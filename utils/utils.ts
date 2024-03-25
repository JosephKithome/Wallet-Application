export function accountNumberGenerator(): string {
    let accountNumber = '';
    const digits = '0123456789';

    // Generate 12 random digits
    for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        accountNumber += digits[randomIndex];
    }

    return accountNumber;
}

export const getWalletExpiryDate = (): string=> {
    const currentDate = new Date();
    
    // Add 2 years to the current date
   return currentDate.setFullYear(currentDate.getFullYear() + 3).toString();
}

// generate random cvv number
export const generateRandomCVV = (): string => {
    const digits = '0123456789';
    let cvv = '';
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        cvv += digits[randomIndex];
    }
    return cvv;
}
    
    
