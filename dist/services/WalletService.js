"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sms_1 = require("../integrations/sms");
const schema_1 = require("../models/schema");
const utils_1 = require("./../utils/utils");
class WalletService {
    constructor() {
        this.helper = new utils_1.WalletHelper();
    }
    createWallet(walletData, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, openedAt, expiresAt, isSuspended, balance, currency } = walletData.body;
                // Check if the authorization header is missing
                if (!token || token === "null") {
                    return { success: false, error: "Unauthorized" };
                }
                // Check if the token is null
                if (token === "null") {
                    return { success: false, error: "Unauthorized" };
                }
                let payload;
                try {
                    // Verify the token
                    payload = jsonwebtoken_1.default.verify(token, `${process.env.SECRET_KEY}`);
                }
                catch (error) {
                    return { success: false, error: "Unauthorized" };
                }
                // Check if payload is valid
                if (!payload || typeof payload === 'string') {
                    return { success: false, error: "Unauthorized" };
                }
                // Check if the token has expired
                if (payload.expiresAt && payload.expiresAt < Math.floor(Date.now() / 1000)) {
                    return { success: false, error: "Token has expired" };
                }
                // Extract userId from payload
                const userId = payload.subject;
                // Check if the user already has a wallet
                const existingWallet = yield schema_1.Wallet.findOne({ userId: userId });
                if (existingWallet) {
                    return { success: false, error: "User already has a wallet" };
                }
                // Check if name is empty when creating a new wallet
                if (!name) {
                    return { success: false, error: "Name of the wallet cannot be empty" };
                }
                // check whether the currency provided exists 
                const currencyExists = yield schema_1.Currency.findOne({ code: currency });
                if (!currencyExists) {
                    return { success: false, error: "Currency not found" };
                }
                // check whether a wallet exists by the name provided
                const wallet = yield schema_1.Wallet.findOne({ name: name });
                if (wallet) {
                    return { success: false, error: `Wallet by name ${name}  already exists` };
                }
                // Create a new wallet for the user
                const newWallet = new schema_1.Wallet({
                    userId: userId,
                    name: name,
                    balance: 0,
                    walletAccountNumber: this.helper.accountNumberGenerator(),
                    expiresAt: this.helper.getWalletExpiryDate(),
                    currency: currencyExists._id
                });
                yield newWallet.save();
                return { success: true, wallet: newWallet };
            }
            catch (error) {
                return { success: false, error: "Error when creating a wallet" };
            }
        });
    }
    debitWallet(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { amount, walletAccountNumber } = req.body;
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                if (!token) {
                    return { success: false, error: "Unauthorized request!!" };
                }
                let payload;
                try {
                    payload = jsonwebtoken_1.default.verify(token, `${process.env.SECRET_KEY}`);
                }
                catch (error) {
                    return { success: false, error: "Unauthorized" };
                }
                if (!payload || typeof payload === 'string') {
                    return { success: false, error: "Unauthorized" };
                }
                // Check if the token has expired
                if (payload.expiresAt && payload.expiresAt < Math.floor(Date.now() / 1000)) {
                    return { success: false, error: "Token has expired" };
                }
                const userId = payload.subject;
                if (walletAccountNumber === null || walletAccountNumber === undefined) {
                    return { success: false, error: "Account number cannot be empty" };
                }
                if (typeof amount !== 'number' || amount <= 0) {
                    return { success: false, error: "Invalid amount" };
                }
                const wallet = yield schema_1.Wallet.findOne({ userId });
                if (!wallet) {
                    return { success: false, error: "Wallet not found" };
                }
                const receiver = yield schema_1.Wallet.findOne({ walletAccountNumber });
                if (!receiver) {
                    return { success: false, error: "Receiver wallet not found" };
                }
                if (amount > wallet.balance) {
                    return { success: false, error: "Insufficient funds" };
                }
                receiver.balance += amount;
                yield receiver.save();
                const senderTransaction = yield schema_1.Transaction.create({
                    senderId: userId,
                    amount,
                    type: 'debit'
                });
                senderTransaction.save();
                wallet.balance -= amount;
                yield wallet.save();
                const receiverTransaction = yield schema_1.Transaction.create({
                    senderId: userId,
                    receiverWalletAccountNumber: receiver.walletAccountNumber,
                    amount,
                    type: 'credit'
                });
                receiverTransaction.save();
                // send notification
                const message = new schema_1.Notification({
                    userId: wallet.userId,
                    message: `Congratulations ${amount} Kes  credited  to ${receiver.walletAccountNumber} ${wallet.name} on ${new Date()}`,
                    timestamp: new Date()
                });
                yield message.save();
                (0, sms_1.sendSMSNotification)("254717064174", message.message);
                // send notification
                const msg = new schema_1.Notification({
                    userId: wallet.userId,
                    message: `Confirmed ${amount} Kes  debited  from ${wallet.walletAccountNumber} ${wallet.name} on ${new Date()}`,
                    timestamp: new Date()
                });
                yield msg.save();
                (0, sms_1.sendSMSNotification)("254717064174", message.message);
                return { success: true, wallet };
            }
            catch (error) {
                console.error('Error debiting wallet:', error);
                throw new Error("An unexpected error occurred");
            }
        });
    }
    getWalletBalance(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { walletAccountNumber } = req.body;
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                if (!token) {
                    return { success: false, error: "Unauthorized request!!" };
                }
                let payload;
                try {
                    payload = jsonwebtoken_1.default.verify(token, `${process.env.SECRET_KEY}`);
                }
                catch (error) {
                    return { success: false, error: "Unauthorized" };
                }
                if (!payload || typeof payload === 'string') {
                    return { success: false, error: "Unauthorized" };
                }
                // Check if the token has expired
                if (payload.expiresAt && payload.expiresAt < Math.floor(Date.now() / 1000)) {
                    return { success: false, error: "Token has expired" };
                }
                const userId = payload.subject;
                if (walletAccountNumber == "" || walletAccountNumber === undefined) {
                    return { success: false, error: "Account number cannot be empty" };
                }
                const wallet = yield schema_1.Wallet.findOne({ userId, walletAccountNumber });
                if (!wallet) {
                    return { success: false, error: "Wallet not found" };
                }
                return { success: true, wallet };
            }
            catch (error) {
                return { success: false, error: "An unexpected error occurred" };
            }
        });
    }
    getWalletByName(walletData, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = walletData.body;
                // Check if the authorization header is missing
                if (!token || token === "null") {
                    return { success: false, error: "Unauthorized" };
                }
                // Check if the token is null
                if (token === "null") {
                    return { success: false, error: "Unauthorized" };
                }
                let payload;
                try {
                    // Verify the token
                    payload = jsonwebtoken_1.default.verify(token, `${process.env.SECRET_KEY}`);
                }
                catch (error) {
                    return { success: false, error: "Unauthorized" };
                }
                // Check if the token has expired
                if (payload.expiresAt && payload.expiresAt < Math.floor(Date.now() / 1000)) {
                    return { success: false, error: "Token has expired" };
                }
                // Check if payload is valid
                if (!payload || typeof payload === 'string') {
                    return { success: false, error: "Unauthorized" };
                }
                // Extract userId from payload
                const userId = payload.subject;
                // check if name is  not null
                if (name === null || name === "") {
                    return { success: false, error: "Name of the wallet cannot be empty" };
                }
                const wallet = yield schema_1.Wallet.findOne({ name: name });
                if (!wallet) {
                    return { success: false, error: `Wallet by name ${name}  not found` };
                }
                return { success: true, wallet: wallet };
            }
            catch (error) {
                return { success: false, error: "Error retrieving a wallet" };
            }
        });
    }
    creditWallet(req, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const { amount } = req.body;
            try {
                // Check if the authorization header is missing
                if (!token || token === "null") {
                    return { success: false, error: "Unauthorized" };
                }
                // Check if the token is null
                if (token === "null") {
                    return { success: false, error: "Unauthorized" };
                }
                let payload;
                try {
                    // Verify the token
                    payload = jsonwebtoken_1.default.verify(token, `${process.env.SECRET_KEY}`);
                }
                catch (error) {
                    return { success: false, error: "Unauthorized" };
                }
                // Check if payload is valid
                if (!payload || typeof payload === 'string') {
                    return { success: false, error: "Unauthorized" };
                }
                // Check if the token has expired
                if (payload.expiresAt && payload.expiresAt < Math.floor(Date.now() / 1000)) {
                    return { success: false, error: "Token has expired" };
                }
                // Extract userId from payload
                const userId = payload.subject;
                const wallet = yield schema_1.Wallet.findOne({ userId });
                if (!wallet) {
                    return { success: false, error: "Wallet not foun" };
                }
                if (typeof amount !== 'number' || amount <= 0) {
                    return { success: false, error: 'Invalid amount' };
                }
                wallet.balance += amount;
                yield wallet.save();
                const transaction = yield schema_1.Transaction.create({
                    senderId: userId,
                    amount,
                    type: 'credit'
                });
                transaction.save();
                // send notification
                const message = new schema_1.Notification({
                    userId: wallet.userId,
                    message: `Confirmed ${amount} Kes  deposited  to ${wallet.walletAccountNumber} ${wallet.name} on ${new Date()}`,
                    timestamp: new Date()
                });
                yield message.save();
                (0, sms_1.sendSMSNotification)("254717064174", message.message);
                return { success: true, wallet: wallet };
            }
            catch (error) {
                console.error('Error crediting wallet:', error);
                return { success: false, error: "Error retrieving a wallet" };
            }
        });
    }
    withdrawFunds(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { amount } = req.body;
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                if (!token) {
                    return { success: false, error: "Unauthorized request!!" };
                }
                let payload;
                try {
                    payload = jsonwebtoken_1.default.verify(token, `${process.env.SECRET_KEY}`);
                }
                catch (error) {
                    return { success: false, error: "Unauthorized" };
                }
                if (!payload || typeof payload === 'string') {
                    return { success: false, error: "Unauthorized" };
                }
                // Check if the token has expired
                if (payload.expiresAt && payload.expiresAt < Math.floor(Date.now() / 1000)) {
                    return { success: false, error: "Token has expired" };
                }
                const userId = payload.subject;
                if (amount === null || amount === undefined || amount <= 0) {
                    return { success: false, error: "Amount cannot be empty or zero" };
                }
                if (userId !== req.params.userId) {
                    return { success: false, error: "You can only withdraw from your own account" };
                }
                const wallet = yield schema_1.Wallet.findOne({ userId });
                if (!wallet) {
                    return { success: false, error: "Wallet not found" };
                }
                if (wallet.balance < amount) {
                    return { success: false, error: "Insufficient funds" };
                }
                wallet.balance -= amount;
                yield wallet.save();
                // send notification
                const message = new schema_1.Notification({
                    userId: wallet.userId,
                    message: `Confirmed ${amount} Kes  withdrawn from  ${wallet.walletAccountNumber} ${wallet.name} on ${new Date()}`,
                    timestamp: new Date()
                });
                yield message.save();
                (0, sms_1.sendSMSNotification)("254717064174", message.message);
                return { success: true, newBalance: wallet.balance };
            }
            catch (error) {
                console.error('Error withdrawing funds:', error);
                throw new Error("Internal server error");
            }
        });
    }
}
exports.default = WalletService;