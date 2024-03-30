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
exports.UserController = void 0;
const UserService_1 = __importDefault(require("../../services/UserService"));
class UserController {
    getUserById(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = req.params.userId;
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                const userService = new UserService_1.default();
                const result = yield userService.getUserById(userId, token || '');
                if (result.success) {
                    resp.json(result.data);
                }
                else {
                    resp.status(401).json({ error: result.error });
                }
            }
            catch (error) {
                console.error(error);
                resp.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    updateUserProfile(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = req.params.userId;
                const userData = req.body;
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                const userService = new UserService_1.default();
                const result = yield userService.updateUserProfile(userId, userData, token || '');
                if (result.success) {
                    resp.json(result.updatedUser);
                }
                else {
                    resp.status(401).json({ error: result.error });
                }
            }
            catch (error) {
                console.error(error);
                resp.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.UserController = UserController;
