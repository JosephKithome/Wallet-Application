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
                .connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@vibewire.uze1ulu.mongodb.net/?retryWrites=true&w=majority&appName=vibewire`)
                .then(() => {
                console.log('Connected to MongoDB');
            })
                .catch((error) => {
                console.log('MongoDB connection error:', error.message.toString());
            });
        };
    }
}
exports.MongoConnector = MongoConnector;
