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
const schema_1 = require("../models/schema");
const sms_1 = require("../integrations/sms");
class TransactionService {
    sendFunds(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { amount, receiverAccountNumber } = req.body;
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
                const userId = payload.subject;
                if (receiverAccountNumber === null || receiverAccountNumber === undefined) {
                    return { success: false, error: "Receiver account number cannot be empty" };
                }
                if (typeof amount !== 'number' || amount <= 0) {
                    return { success: false, error: "Invalid amount" };
                }
                const wallet = yield schema_1.Wallet.findOne({ userId });
                if (!wallet) {
                    return { success: false, error: "Wallet for user not found" };
                }
                if (amount > wallet.balance) {
                    return { success: false, error: "Insufficient funds" };
                }
                const receiver = yield schema_1.Wallet.findOne({ walletAccountNumber: receiverAccountNumber });
                if (!receiver) {
                    return { success: false, error: "Receiver's Wallet not found" };
                }
                receiver.balance += amount;
                yield receiver.save();
                wallet.balance -= amount;
                yield wallet.save();
                const transaction = new schema_1.Transaction({
                    senderId: wallet.userId,
                    receiverId: receiver.userId,
                    amount,
                    walletAccountNumber: wallet.walletAccountNumber,
                    name: wallet.name,
                    type: 'debit',
                });
                transaction.save();
                const message = new schema_1.Notification({
                    userId: wallet.userId,
                    message: `Confirmed ${amount} Kes send to ${receiver.walletAccountNumber} ${wallet.name} on ${new Date()}`,
                    timestamp: new Date()
                });
                yield message.save();
                // Trigger notification here
                (0, sms_1.sendSMSNotification)("254717064174", message.message);
                const tr = new schema_1.Transaction({
                    senderId: receiver.userId,
                    receiverId: wallet.userId,
                    amount,
                    walletAccountNumber: receiver.walletAccountNumber,
                    name: receiver.name,
                    type: 'credit',
                });
                yield tr.save();
                const msg = new schema_1.Notification({
                    userId: wallet.userId,
                    message: `You have received ${amount} from ${receiver.walletAccountNumber}`,
                    timestamp: new Date()
                });
                yield msg.save();
                return { success: true, newBalance: wallet.balance };
            }
            catch (error) {
                console.error('Error sending funds:', error);
                throw new Error("Internal server error");
            }
        });
    }
    getWalletTransactions(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
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
                const userId = payload.subject;
                const { user, walletId } = req.body;
                const transactions = yield schema_1.Transaction.find({
                    $or: [{ senderId: userId }, { receiverId: userId }],
                }).sort({ timestamp: -1 });
                return { success: true, transactions };
            }
            catch (error) {
                throw new Error("Internal server error");
            }
        });
    }
    getTransactionsByWalletId(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
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
                const userId = payload.subject;
                const { walletId } = req.params;
                // Query the database to find all transactions associated with the given walletId
                const transactions = yield schema_1.Transaction.find({ walletAccountNumber: walletId });
                return { success: true, transactions };
            }
            catch (error) {
                console.error('Error fetching transactions:', error);
                throw new Error("Internal server error");
            }
        });
    }
}
exports.default = TransactionService;
