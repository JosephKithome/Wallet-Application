"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoConnector = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../utils/logger");
class MongoConnector {
    constructor() {
        this.logger = new logger_1.CustomLogger();
        this.connect = () => {
            mongoose_1.default
                .connect('mongodb+srv://blackberry:6NRlEX0xkOj0lXEa@vibewire.uze1ulu.mongodb.net/?retryWrites=true&w=majority&appName=vibewire')
                .then(() => {
                this.logger.logInfo('Connected to MongoDB');
            })
                .catch((error) => {
                this.logger.logError('MongoDB connection error:', error.message.toString());
            });
        };
    }
}
exports.MongoConnector = MongoConnector;
