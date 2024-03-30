"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletHelper = void 0;
class WalletHelper {
    constructor() {
        this.accountNumberGenerator = () => {
            let accountNumber = '';
            const digits = '0123456789';
            // Generate 12 random digits
            for (let i = 0; i < 12; i++) {
                const randomIndex = Math.floor(Math.random() * digits.length);
                accountNumber += digits[randomIndex];
            }
            return accountNumber;
        };
        this.getWalletExpiryDate = () => {
            const currentDate = new Date();
            // Add 3 years to the current date to mark the expiry of a wallet account
            return currentDate.setFullYear(currentDate.getFullYear() + 3).toString();
        };
        // generate random cvv number
        this.generateRandomCVV = () => {
            const digits = '0123456789';
            let cvv = '';
            for (let i = 0; i < 3; i++) {
                const randomIndex = Math.floor(Math.random() * digits.length);
                cvv += digits[randomIndex];
            }
            return cvv;
        };
    }
}
exports.WalletHelper = WalletHelper;
