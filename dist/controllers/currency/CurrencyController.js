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
exports.CurrencyController = void 0;
const CurrencyService_1 = __importDefault(require("../../services/CurrencyService"));
class CurrencyController {
    createCurrency(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currencyService = new CurrencyService_1.default();
                const result = yield currencyService.createCurrency(req);
                if (result.success) {
                    resp.status(201).json({ message: 'Currency created successfully', currency: result.currency });
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
    getCurrencies(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currencyService = new CurrencyService_1.default();
                const result = yield currencyService.getCurrencies(req);
                if (result.success) {
                    resp.status(200).json({ message: 'Success', currencies: result.currencies });
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
exports.CurrencyController = CurrencyController;
