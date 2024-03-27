import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { BankAccount, Currency } from '../models/schema';
import {
    accountNumberGenerator,
    generateRandomCVV,
    getWalletExpiryDate
} from '../utils/utils';

class BankService {
    async createBankAccount(req: Request): Promise<{ success: boolean; bankAccount?: any; error?: string }> {
        try {
            const { name, currency, status } = req.body;

            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return { success: false, error: "Unauthorized request!!" };
            }

            let payload: any;

            try {
                payload = jwt.verify(token, `${process.env.SECRET_KEY}`);
            } catch (error) {
                return { success: false, error: "Unauthorized" };
            }

            if (!payload || typeof payload === 'string') {
                return { success: false, error: "Unauthorized" };
            }

            // Extract userId from payload
            const userId = payload.subject;

            // Check if currency and status were provided
            if (!currency || !status) {
                return { success: false, error: 'Currency and status are required' };
            }

            // Check if name was provided
            if (!name) {
                return { success: false, error: 'Name is required' };
            }

            // Validate the currency
            const currencyExists = await Currency.findOne({ code: currency });
            if (!currencyExists) {
                return { success: false, error: 'Currency not found' };
            }

            // Create a new bank account
            const newBankAccount = new BankAccount({
                userId: userId,
                name: name,
                accountNumber: accountNumberGenerator().toString(),
                openedAt: new Date(),
                expiresAt: getWalletExpiryDate(),
                cvv: generateRandomCVV(),
                balance: 0,
                status: status,
                currency: currency
            });
            await newBankAccount.save();

            return { success: true, bankAccount: newBankAccount };
        } catch (error) {
            console.error('Error creating bank account:', error);
            throw new Error("An unexpected error occurred");
        }
    }
}

export default BankService;
