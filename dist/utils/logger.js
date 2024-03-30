"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomLogger = void 0;
const winston_1 = __importDefault(require("winston"));
class CustomLogger {
    constructor() {
        this.logger = winston_1.default.createLogger({
            transports: [
                new winston_1.default.transports.Console(),
                new winston_1.default.transports.File({ filename: 'error.log', level: 'error' }),
                new winston_1.default.transports.File({ filename: 'info.log', level: 'info' }),
                new winston_1.default.transports.File({ filename: 'debug.log', level: 'debug' }),
                new winston_1.default.transports.File({ filename: 'warn.log', level: 'warn' }),
            ]
        });
    }
    logInfo(message, level = 'info') {
        this.logger.log({
            level: level,
            message: message
        });
    }
    logError(message, level = 'error') {
        this.logger.log({
            level: level,
            message: message
        });
    }
    logDebug(message, level = 'debug') {
        this.logger.log({
            level: level,
            message: message
        });
    }
    logWarn(message, level = 'warn') {
        this.logger.log({
            level: level,
            message: message
        });
    }
}
exports.CustomLogger = CustomLogger;
