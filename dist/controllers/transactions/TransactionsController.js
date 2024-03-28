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
exports.TransactionController = void 0;
const TransactionsService_1 = __importDefault(require("../../services/TransactionsService"));
class TransactionController {
    sendFunds(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactionService = new TransactionsService_1.default();
                const result = yield transactionService.sendFunds(req);
                if (result.success) {
                    resp.json({ message: 'Funds sent successfully', newBalance: result.newBalance });
                }
                else {
                    resp.status(400).json({ error: result.error });
                }
            }
            catch (error) {
                console.error(error);
                resp.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    getWalletTransactions(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactionService = new TransactionsService_1.default();
                const result = yield transactionService.getWalletTransactions(req);
                if (result.success) {
                    resp.json(result.transactions);
                }
                else {
                    resp.status(400).json({ error: result.error });
                }
            }
            catch (error) {
                console.error(error);
                resp.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    getTransactionsByWalletId(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactionService = new TransactionsService_1.default();
                const result = yield transactionService.getTransactionsByWalletId(req);
                if (result.success) {
                    resp.status(200).json({ transactions: result.transactions });
                }
                else {
                    resp.status(401).json({ error: result.error });
                }
            }
            catch (error) {
                console.error(error);
                resp.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.TransactionController = TransactionController;
