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
const schema_1 = require("../models/schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
class AuthService {
    constructor() {
        this.logger = new logger_1.CustomLogger();
        this.logout = () => __awaiter(this, void 0, void 0, function* () {
        });
    }
    registerUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate the incoming user data
                if (userData.email === undefined || userData.email === "") {
                    return { success: false, message: 'Please provide a valid email' };
                }
                if (userData.password === "") {
                    return { success: false, message: 'Please provide a valid password' };
                }
                if (userData.password.length < 8) {
                    return { success: false, message: 'Password must be at least 8 characters long' };
                }
                if (userData.firstName == null || userData.firstName == undefined || userData.lastName == null || userData.lastName == undefined) {
                    return { success: false, message: 'Please provide a valid first and last name' };
                }
                if (userData.phone == "" || userData.phone == undefined) {
                    return { success: false, message: 'Please provide a valid phone number' };
                }
                // Check if user already exists
                const existingUser = yield schema_1.User.findOne({ email: userData.email });
                if (existingUser) {
                    return { success: false, message: 'User already exists' };
                }
                // Hash the password
                const hashedPassword = yield bcrypt_1.default.hash(userData.password, 12);
                userData.password = hashedPassword;
                // Save the user to the database
                const user = new schema_1.User(userData);
                const registeredUser = yield user.save();
                // Generate a token for the user
                const payload = { subject: registeredUser._id };
                const token = jsonwebtoken_1.default.sign(payload, 'secretkey');
                return { success: true, message: 'User registered successfully' };
            }
            catch (error) {
                console.error(error);
                throw new Error("Error occurred while registering user.");
            }
        });
    }
    loginUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Validate the incoming user data
                if (userData.email === "" || userData.password === "") {
                    return { success: false, error: 'Please provide a valid email and password' };
                }
                if (userData.password.length < 8) {
                    return { success: false, error: 'Password must be at least 8 characters long' };
                }
                // Find user by email
                const dbUser = yield schema_1.User.findOne({ email: userData.email });
                if (!dbUser) {
                    return { success: false, error: 'Invalid Email' };
                }
                // Check password
                const passwordMatch = yield bcrypt_1.default.compare(userData.password, dbUser.password);
                if (!passwordMatch) {
                    return { success: false, error: 'Invalid password' };
                }
                // Generate token
                const payload = { subject: dbUser._id, expiresAt: new Date(Date.now() + (1 * 60 * 60 * 1000)) };
                const token = jsonwebtoken_1.default.sign(payload, `${process.env.SECRET_KEY}`);
                return { success: true, token };
            }
            catch (error) {
                console.error(error);
                throw new Error("Internal Server Error");
            }
        });
    }
    resetPassword(req, token) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.logInfo('Reseting  payload: ' + req.body);
            try {
                const { oldPassword, newPassword } = req.body;
                // Check if the authorization header is missing
                if (!token || token === "null") {
                    return { success: false, error: "Unauthorized" };
                }
                // Check if the token is null
                if (token === "null") {
                    return { success: false, error: "Unauthorized" };
                }
                let payload;
                try {
                    // Verify the token
                    payload = jsonwebtoken_1.default.verify(token, `${process.env.SECRET_KEY}`);
                }
                catch (error) {
                    return { success: false, error: "Unauthorized" };
                }
                // Check if payload is valid
                if (!payload || typeof payload === 'string') {
                    return { success: false, error: "Unauthorized" };
                }
                // Check if the token has expired
                if (payload.expiresAt && payload.expiresAt < Math.floor(Date.now() / 1000)) {
                    return { success: false, error: "Token has expired" };
                }
                // Extract userId from payload
                const userId = payload.subject;
                this.logger.logInfo("UserID: " + userId);
                // Check if the user already has a wallet
                const existingUser = yield schema_1.User.findOne({ userId: userId });
                if (!existingUser) {
                    return { success: false, error: "No user Found!" };
                }
                else {
                    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 12);
                    existingUser.password = hashedPassword;
                    existingUser.save();
                    return { success: false, error: "Password changed successfully" };
                }
            }
            catch (error) {
                this.logger.logError('Error changing password:', error.message.toString());
                return { success: false, error: "Error when changing password" };
            }
        });
    }
}
exports.default = AuthService;
