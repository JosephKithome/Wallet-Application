"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomLogger = void 0;
var winston_1 = require("winston");
var CustomLogger = /** @class */ (function () {
    function CustomLogger() {
        this.logger = winston_1.default.createLogger({
            transports: [
                new winston_1.default.transports.Console(),
                new winston_1.default.transports.File({ filename: 'logs/error.log', level: 'error' }),
                new winston_1.default.transports.File({ filename: 'logs/info.log', level: 'info' }),
                new winston_1.default.transports.File({ filename: 'logs/debug.log', level: 'debug' }),
                new winston_1.default.transports.File({ filename: 'logs/warn.log', level: 'warn' }),
            ]
        });
    }
    CustomLogger.prototype.logInfo = function (message, level) {
        if (level === void 0) { level = 'info'; }
        this.logger.log({
            level: level,
            message: message
        });
    };
    CustomLogger.prototype.logError = function (message, level) {
        if (level === void 0) { level = 'error'; }
        this.logger.log({
            level: level,
            message: message
        });
    };
    CustomLogger.prototype.logDebug = function (message, level) {
        if (level === void 0) { level = 'debug'; }
        this.logger.log({
            level: level,
            message: message
        });
    };
    CustomLogger.prototype.logWarn = function (message, level) {
        if (level === void 0) { level = 'warn'; }
        this.logger.log({
            level: level,
            message: message
        });
    };
    return CustomLogger;
}());
exports.CustomLogger = CustomLogger;
