"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dbConection = () => {
    mongoose_1.default
        .connect(`${process.env.MONGO_URI}`)
        .then(() => {
        console.log('Connected to MongoDB');
    })
        .catch((error) => {
        console.error('MongoDB connection error:', error);
    });
};
exports.dbConection = dbConection;
