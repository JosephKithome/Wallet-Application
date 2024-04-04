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
const AuthController_1 = require("../controllers/auth/AuthController");
const AuthService_1 = __importDefault(require("../services/AuthService"));
// Mocking the AuthService
jest.mock('../../services/AuthService');
// Mocking the Request and Response objects
const mockRequest = {};
const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
};
describe('AuthController', () => {
    describe('signUp', () => {
        it('should return 200 status with success message if registration succeeds', () => __awaiter(void 0, void 0, void 0, function* () {
            const authService = new AuthService_1.default();
            const authController = new AuthController_1.AuthController();
            authService.registerUser.mockResolvedValueOnce({ success: true, message: 'User registered successfully' });
            yield authController.signUp(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
        }));
        it('should return 400 status with error message if registration fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const authService = new AuthService_1.default();
            const authController = new AuthController_1.AuthController();
            authService.registerUser.mockResolvedValueOnce({ success: false, message: 'Email already exists' });
            yield authController.signUp(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Email already exists' });
        }));
        it('should return 500 status if an error occurs during registration', () => __awaiter(void 0, void 0, void 0, function* () {
            const authService = new AuthService_1.default();
            authService.registerUser.mockRejectedValueOnce(new Error('Database error'));
            const authController = new AuthController_1.AuthController();
            yield authController.signUp(mockRequest, mockResponse);
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.send).toHaveBeenCalledWith('Error occurred while registering user.');
        }));
    });
});
