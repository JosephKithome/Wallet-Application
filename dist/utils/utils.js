"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletExpiryDate = exports.accountNumberGenerator = void 0;
function accountNumberGenerator() {
    let accountNumber = '';
    const digits = '0123456789';
    // Generate 12 random digits
    for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        accountNumber += digits[randomIndex];
    }
    return accountNumber;
}
exports.accountNumberGenerator = accountNumberGenerator;
const getWalletExpiryDate = () => {
    const currentDate = new Date();
    // Add 2 years to the current date
    return currentDate.setFullYear(currentDate.getFullYear() + 3).toString();
};
exports.getWalletExpiryDate = getWalletExpiryDate;
