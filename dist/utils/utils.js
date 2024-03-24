export function accountNumberGenerator() {
    var accountNumber = '';
    var digits = '0123456789';
    // Generate 12 random digits
    for (var i = 0; i < 12; i++) {
        var randomIndex = Math.floor(Math.random() * digits.length);
        accountNumber += digits[randomIndex];
    }
    return accountNumber;
}
export var getWalletExpiryDate = function () {
    var currentDate = new Date();
    // Add 2 years to the current date
    return currentDate.setFullYear(currentDate.getFullYear() + 3).toString();
};
