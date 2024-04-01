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
exports.AuthController = void 0;
const AuthService_1 = __importDefault(require("../../services/AuthService"));
class AuthController {
    signUp(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const authService = new AuthService_1.default();
                const result = yield authService.registerUser(userData);
                if (result.success) {
                    resp.status(200).json({ message: result.message });
                }
                else {
                    resp.status(400).json({ error: result.message });
                }
            }
            catch (error) {
                console.error(error);
                resp.status(500).send("Error occurred while registering user.");
            }
        });
    }
    login(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const authService = new AuthService_1.default();
                const result = yield authService.loginUser(userData);
                if (result.success) {
                    resp.status(200).json({ token: result.token });
                }
                else {
                    resp.status(401).json({ error: result.error });
                }
            }
            catch (error) {
                console.error(error);
                resp.status(500).send("Internal Server Error");
            }
        });
    }
    resetPassword(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const authService = new AuthService_1.default();
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                const result = yield authService.resetPassword(req, token || '');
                if (result.success) {
                    resp.status(201).json({ message: 'Password changed successfully', wallet: result.user });
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
}
exports.AuthController = AuthController;
