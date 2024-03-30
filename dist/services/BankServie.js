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
const utils_1 = require("./../utils/utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const schema_1 = require("../models/schema");
class BankService {
    constructor() {
        this.helper = new utils_1.WalletHelper();
    }
    createBankAccount(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { name, currency, status } = req.body;
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
                // Extract userId from payload
                const userId = payload.subject;
                // Check if currency and status were provided
                if (!currency || !status) {
                    return { success: false, error: 'Currency and status are required' };
                }
                // Check if name was provided
                if (!name) {
                    return { success: false, error: 'Name is required' };
                }
                // Validate the currency
                const currencyExists = yield schema_1.Currency.findOne({ code: currency });
                if (!currencyExists) {
                    return { success: false, error: 'Currency not found' };
                }
                // Create a new bank account
                const newBankAccount = new schema_1.BankAccount({
                    userId: userId,
                    name: name,
                    accountNumber: this.helper.accountNumberGenerator().toString(),
                    openedAt: new Date(),
                    expiresAt: this.helper.getWalletExpiryDate(),
                    cvv: this.helper.generateRandomCVV(),
                    balance: 0,
                    status: status,
                    currency: currency
                });
                yield newBankAccount.save();
                return { success: true, bankAccount: newBankAccount };
            }
            catch (error) {
                console.error('Error creating bank account:', error);
                throw new Error("An unexpected error occurred");
            }
        });
    }
}
exports.default = BankService;
