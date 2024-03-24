"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConection = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var dbConection = function () {
    mongoose_1.default
        .connect("".concat(process.env.MONGO_URI))
        .then(function () {
        console.log('Connected to MongoDB');
    })
        .catch(function (error) {
        console.error('MongoDB connection error:', error);
    });
};
exports.dbConection = dbConection;
