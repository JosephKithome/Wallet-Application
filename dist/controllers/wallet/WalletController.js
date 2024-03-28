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
exports.WalletControlller = void 0;
const WalletService_1 = __importDefault(require("../../services/WalletService"));
class WalletControlller {
    createWallet(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const walletService = new WalletService_1.default();
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                const result = yield walletService.createWallet(req, token || '');
                if (result.success) {
                    resp.status(201).json({ message: 'Wallet created successfully', wallet: result.wallet });
                }
                else {
                    resp.status(400).json({ error: result.error });
                }
            }
            catch (error) {
                resp.status(500).json({ error: 'An unexpected error occurred' });
            }
        });
    }
    creditWallet(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const walletService = new WalletService_1.default();
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                const result = yield walletService.creditWallet(req, token || '');
                if (result.success) {
                    resp.status(201).json({ message: 'Wallet credited successfully', wallet: result.wallet });
                }
                else {
                    resp.status(400).json({ error: result.error });
                }
            }
            catch (error) {
                console.error(error);
                resp.status(500).json({ error: 'An unexpected error occurred' });
            }
        });
    }
    getWalletbyName(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const walletService = new WalletService_1.default();
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                const result = yield walletService.getWalletByName(req, token || '');
                if (result.success) {
                    resp.status(201).json({ message: 'Success', wallet: result.wallet });
                }
                else {
                    resp.status(400).json({ error: result.error });
                }
            }
            catch (error) {
                console.error(error);
                resp.status(500).json({ error: 'An unexpected error occurred' });
            }
        });
    }
    debitWallet(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const walletService = new WalletService_1.default();
                const result = yield walletService.debitWallet(req);
                if (result.success) {
                    resp.status(200).json({ message: 'Wallet debited successfully', wallet: result.wallet });
                }
                else {
                    resp.status(400).json({ error: result.error });
                }
            }
            catch (error) {
                console.error(error);
                resp.status(500).json({ error: 'An unexpected error occurred' });
            }
        });
    }
    getWalletBalance(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const walletService = new WalletService_1.default();
                const result = yield walletService.getWalletBalance(req);
                if (result.success) {
                    resp.status(200).json({ message: 'Success', wallet: result.wallet });
                }
                else {
                    resp.status(400).json({ error: result.error });
                }
            }
            catch (error) {
                console.error(error);
                resp.status(500).json({ error: 'An unexpected error occurred' });
            }
        });
    }
    withdrawFunds(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const withdrawalService = new WalletService_1.default();
                const result = yield withdrawalService.withdrawFunds(req);
                if (result.success) {
                    resp.json({ message: 'Withdrawal successful', newBalance: result.newBalance });
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
}
exports.WalletControlller = WalletControlller;
