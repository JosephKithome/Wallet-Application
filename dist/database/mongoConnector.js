"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoConnector = void 0;
var mongoose_1 = require("mongoose");
var logger_1 = require("../../utils/logger");
var MongoConnector = /** @class */ (function () {
    function MongoConnector() {
        this.logger = new logger_1.CustomLogger();
        this.connect = function () {
            mongoose_1.default
                .connect("mongodb+srv://".concat(process.env.MONGO_USER, ":").concat(process.env.MONGO_PASSWORD, "@vibewire.uze1ulu.mongodb.net/?retryWrites=true&w=majority&appName=vibewire"))
                .then(function () {
                console.log('Connected to MongoDB');
            })
                .catch(function (error) {
                console.log('MongoDB connection error:', error.message.toString());
            });
        };
    }
    return MongoConnector;
}());
exports.MongoConnector = MongoConnector;
