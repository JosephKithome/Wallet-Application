"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Currency = exports.Notification = exports.TransactionCategory = exports.PaymentMethod = exports.BankAccount = exports.Transaction = exports.Wallet = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: String, required: false },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: false },
});
exports.User = mongoose_1.default.model('User', userSchema);
const walletSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    balance: { type: Number, default: 0 },
    name: { type: String, required: false },
    transactions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Transaction' }],
    walletAccountNumber: { type: String, required: true },
    openedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    isSuspended: { type: Boolean, default: false }
});
exports.Wallet = mongoose_1.default.model('Wallet', walletSchema);
const transactionSchema = new mongoose_1.Schema({
    senderId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: false },
    amount: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ['credit', 'debit'], required: true },
});
exports.Transaction = mongoose_1.default.model('Transaction', transactionSchema);
const bankAccountSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    accountNumber: { type: String, required: true },
    openedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    cvv: { type: String, required: true },
    balance: { type: Number, default: 0 },
    status: { type: String, default: 'active' },
    currency: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Currency', required: true },
});
exports.BankAccount = mongoose_1.default.model('BankAccount', bankAccountSchema);
const paymentMethodSchema = new mongoose_1.Schema({
    _id: { type: 'string', required: true },
    name: { type: String, required: true },
});
exports.PaymentMethod = mongoose_1.default.model('PaymentMethod', paymentMethodSchema);
const transactionCategorySchema = new mongoose_1.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    transactionDate: { type: Date, default: Date.now },
    description: { type: String, required: false },
});
exports.TransactionCategory = mongoose_1.default.model('TransactionCategory', transactionCategorySchema);
const notificationSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    // Additional metadata fields
});
exports.Notification = mongoose_1.default.model('Notification', notificationSchema);
// Define Mongoose schema for the currency
const currencySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    country: { type: String, required: true },
});
// Create and export the Mongoose model
exports.Currency = mongoose_1.default.model('Currency', currencySchema);
/*****************************************End currency schema***************************************************************************** */
