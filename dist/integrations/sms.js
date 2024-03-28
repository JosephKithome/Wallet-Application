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
exports.sendSMSNotification = void 0;
const axios_1 = __importDefault(require("axios"));
const sendSMSNotification = (to, text) => __awaiter(void 0, void 0, void 0, function* () {
    const apikey = process.env.AFRICASTALKING_API_KEY || "";
    const url = process.env.AFRICASTALKING_URL || "";
    const username = process.env.AFRICASTALKING_USERNAME || "";
    console.log("USERNAME", username);
    try {
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'apiKey': apikey,
        };
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('to', `+${to}`);
        formData.append('message', text);
        formData.append('apikey', apikey);
        const response = yield axios_1.default.post(url, formData.toString(), { headers });
        console.log('Response Status Code:', response.status);
        console.log('Response Body:', response.data);
        return response.data;
    }
    catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
});
exports.sendSMSNotification = sendSMSNotification;
