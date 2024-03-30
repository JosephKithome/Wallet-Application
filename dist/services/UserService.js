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
const logger_1 = require("../utils/logger");
class UserService {
    constructor() {
        this.logger = new logger_1.CustomLogger();
    }
    getUserById(userId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.logInfo('getUserById', userId);
            try {
                // Check if the token is null or missing
                if (!token || token === "null") {
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
                // Validate if user ID was provided
                if (!userId) {
                    return { success: false, error: "Please provide a valid user ID" };
                }
                // Find user by ID
                const user = yield schema_1.User.findById(userId);
                if (!user) {
                    return { success: false, error: "User not found" };
                }
                return { success: true, user };
            }
            catch (error) {
                this.logger.logError('Error fetching user:', error.message);
                throw new Error("Internal server error");
            }
        });
    }
    updateUserProfile(userId, userData, token) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.logInfo("updateUserProfile', userId: " + userId);
            try {
                // Check if the token is null or missing
                if (!token || token === "null") {
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
                // Validate if user ID was provided
                if (!userId) {
                    return { success: false, error: "Please provide a valid user ID" };
                }
                // Find user by ID and update
                const updatedUser = yield schema_1.User.findByIdAndUpdate(userId, userData, { new: true });
                if (!updatedUser) {
                    return { success: false, error: "User not found" };
                }
                return { success: true, updatedUser };
            }
            catch (error) {
                this.logger.logError('Error updating user profile', error.message.toString());
                return { success: false, error: "Error updating user profile" };
            }
        });
    }
}
exports.default = UserService;
