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
exports.BankController = void 0;
const BankServie_1 = __importDefault(require("../../services/BankServie"));
class BankController {
    createBankAccount(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bankService = new BankServie_1.default();
                const result = yield bankService.createBankAccount(req);
                if (result.success) {
                    resp.status(201).json({ message: 'Bank account created successfully', bankAccount: result.bankAccount });
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
exports.BankController = BankController;
