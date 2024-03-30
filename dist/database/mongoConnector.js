"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoConnector = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class MongoConnector {
    constructor() {
        this.connect = () => {
            mongoose_1.default
                .connect('mongodb+srv://blackberry:6NRlEX0xkOj0lXEa@vibewire.uze1ulu.mongodb.net/?retryWrites=true&w=majority&appName=vibewire')
                .then(() => {
                console.log('Connected to MongoDB');
            })
                .catch((error) => {
                console.error('MongoDB connection error:', error);
            });
        };
    }
}
exports.MongoConnector = MongoConnector;
