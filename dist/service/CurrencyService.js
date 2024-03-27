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
class CurrencyService {
    createCurrency(req) {
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
                const { name, code, country } = req.body;
                if (!name || !code || !country) {
                    return { success: false, error: 'Name, code, and country cannot be empty' };
                }
                const existingCurrency = yield schema_1.Currency.findOne({ code: code });
                if (existingCurrency) {
                    return { success: false, error: 'Currency already exists' };
                }
                const newCurrency = new schema_1.Currency({
                    name: name,
                    code: code,
                    country: country
                });
                yield newCurrency.save();
                return { success: true, currency: newCurrency };
            }
            catch (error) {
                console.error('Error creating currency:', error);
                throw new Error("An unexpected error occurred");
            }
        });
    }
    getCurrencies(req) {
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
                // Extract userId from payload
                const userId = payload.subject;
                // Query the database to find all currencies
                const currencies = yield schema_1.Currency.find();
                return { success: true, currencies };
            }
            catch (error) {
                console.error('Error fetching currencies:', error);
                throw new Error("An unexpected error occurred");
            }
        });
    }
}
exports.default = CurrencyService;