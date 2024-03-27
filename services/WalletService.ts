import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { sendSMSNotification } from '../integrations/sms';
import { Wallet, Notification, Transaction } from '../models/schema';
import {
    accountNumberGenerator,
    generateRandomCVV,
    getWalletExpiryDate
} from '../utils/utils';

class WalletService {
    async createWallet(walletData: any, token: string): Promise<{ success: boolean; wallet?: any; error?: string }> {
        try {

            console.log("Database created", walletData)
            const { name, openedAt, expiresAt, isSuspended, balance } = walletData.body;

            // Check if the authorization header is missing
            if (!token || token === "null") {
                return { success: false, error: "Unauthorized" };
            }

            // Check if the token is null
            if (token === "null") {
                return { success: false, error: "Unauthorized" };
            }

            let payload: any;

            try {
                // Verify the token
                payload = jwt.verify(token, `${process.env.SECRET_KEY}`);
            } catch (error) {
                return { success: false, error: "Unauthorized" };
            }

            // Check if payload is valid
            if (!payload || typeof payload === 'string') {
                return { success: false, error: "Unauthorized" };
            }

            // Extract userId from payload
            const userId = payload.subject;

            // Check if the user already has a wallet
            const existingWallet = await Wallet.findOne({ userId: userId });
            if (existingWallet) {
                return { success: false, error: "User already has a wallet" };
            }

            // Check if name is empty when creating a new wallet
            if (!name) {
                return { success: false, error: "Name of the wallet cannot be empty" };
            }

            // check whether a wallet exists by the name provided
            const wallet = await Wallet.findOne({ name: name });
            if (wallet) {
                return { success: false, error: `Wallet by name ${name}  already exists` };
            }

            // Create a new wallet for the user
            const newWallet = new Wallet({
                userId: userId,
                name: name,
                balance: 0,
                walletAccountNumber: accountNumberGenerator(),
                expiresAt: getWalletExpiryDate()
            });
            await newWallet.save();

            return { success: true, wallet: newWallet };
        } catch (error) {
            return { success: false, error: "Error when creating a wallet" };
        }
    }
    async debitWallet(req: Request): Promise<{ success: boolean; wallet?: any; error?: string }> {
        try {
            const { amount, walletAccountNumber } = req.body;

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

            const userId = payload.subject;

            if (walletAccountNumber === null || walletAccountNumber === undefined) {
                return { success: false, error: "Account number cannot be empty" };
            }

            if (typeof amount !== 'number' || amount <= 0) {
                return { success: false, error: "Invalid amount" };
            }

            const wallet = await Wallet.findOne({ userId });

            if (!wallet) {
                return { success: false, error: "Wallet not found" };
            }

            const receiver = await Wallet.findOne({ walletAccountNumber });

            if (!receiver) {
                return { success: false, error: "Receiver wallet not found" };
            }

            if (amount > wallet.balance) {
                return { success: false, error: "Insufficient funds" };
            }

            receiver.balance += amount;
            await receiver.save();

            const senderTransaction = await Transaction.create({
                senderId: userId,
                amount,
                type: 'debit'
            });

            senderTransaction.save();

            wallet.balance -= amount;
            await wallet.save();

            const receiverTransaction = await Transaction.create({
                senderId: userId,
                receiverWalletAccountNumber: receiver.walletAccountNumber,
                amount,
                type: 'credit'
            });
            receiverTransaction.save();

            return { success: true, wallet };
        } catch (error) {
            console.error('Error debiting wallet:', error);
            throw new Error("An unexpected error occurred");
        }
    }

    async getWalletBalance(req: Request): Promise<{ success: boolean; wallet?: any; error?: string }> {
        try {
            const { walletAccountNumber } = req.body;

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

            const userId = payload.subject;

            if (walletAccountNumber =="" || walletAccountNumber === undefined) {
                return { success: false, error: "Account number cannot be empty" };
            }

            const wallet = await Wallet.findOne({ userId, walletAccountNumber });

            if (!wallet) {
                return { success: false, error: "Wallet not found" };
            }

            return { success: true, wallet };
        } catch (error) {
            return { success: false, error: "An unexpected error occurred" };
        }
    }
    async getWalletByName(walletData: any, token: string): Promise<{ success: boolean; wallet?: any; error?: string }> {
        try {

            const { name } = walletData.body;

            // Check if the authorization header is missing
            if (!token || token === "null") {
                return { success: false, error: "Unauthorized" };
            }

            // Check if the token is null
            if (token === "null") {
                return { success: false, error: "Unauthorized" };
            }

            let payload: any;

            try {
                // Verify the token
                payload = jwt.verify(token, `${process.env.SECRET_KEY}`);
            } catch (error) {
                return { success: false, error: "Unauthorized" };
            }

            // Check if payload is valid
            if (!payload || typeof payload === 'string') {
                return { success: false, error: "Unauthorized" };
            }

            // Extract userId from payload
            const userId = payload.subject;

            // check if name is  not null
            if (name === null || name === "") {
                return { success: false, error: "Name of the wallet cannot be empty" };
            }
            const wallet = await Wallet.findOne({ name: name });
            if (!wallet) {
                return { success: false, error: `Wallet by name ${name}  not found` };
            }

            return { success: true, wallet: wallet };
        } catch (error) {
            return { success: false, error: "Error retrieving a wallet" };
        }
    }

    async creditWallet(req: any, token: string): Promise<{ success: boolean; wallet?: any; error?: string }> {
        const { amount } = req.body;

        try {
            // Check if the authorization header is missing
            if (!token || token === "null") {
                return { success: false, error: "Unauthorized" };
            }

            // Check if the token is null
            if (token === "null") {
                return { success: false, error: "Unauthorized" };
            }

            let payload: any;

            try {
                // Verify the token
                payload = jwt.verify(token, `${process.env.SECRET_KEY}`);
            } catch (error) {
                return { success: false, error: "Unauthorized" };
            }

            // Check if payload is valid
            if (!payload || typeof payload === 'string') {
                return { success: false, error: "Unauthorized" };
            }

            // Extract userId from payload
            const userId = payload.subject;


            const wallet = await Wallet.findOne({ userId });

            if (!wallet) {
                return { success: false, error: "Wallet not foun" };
            }

            if (typeof amount !== 'number' || amount <= 0) {
                return { success: false, error: 'Invalid amount' }
            }

            wallet.balance += amount;
            await wallet.save();

            const transaction = await Transaction.create({
                senderId: userId,
                amount,
                type: 'credit'
            });
            
            transaction.save();

            // send notification
            const message = new Notification({
                userId: wallet.userId,
                message: `Confirmed ${amount} Kes  deposited  to ${wallet.walletAccountNumber} ${wallet.name} on ${new Date()}`,
                timestamp: new Date()

            })
            await message.save();

            sendSMSNotification("254717064174", message.message);

            return { success: true, wallet: wallet };
        } catch (error) {
            console.error('Error crediting wallet:', error);
            return { success: false, error: "Error retrieving a wallet" };
        }
    }

    async withdrawFunds(req: Request): Promise<{ success: boolean; newBalance?: number; error?: string }> {
        try {

            const { amount } = req.body;

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

            const userId = payload.subject;

            if (amount === null || amount === undefined || amount <= 0) {
                return { success: false, error: "Amount cannot be empty or zero" };
            }

            if (userId !== req.params.userId) {
                return { success: false, error: "You can only withdraw from your own account" };
            }

            const wallet = await Wallet.findOne({ userId });

            if (!wallet) {
                return { success: false, error: "Wallet not found" };
            }

            if (wallet.balance < amount) {
                return { success: false, error: "Insufficient funds" };
            }

            wallet.balance -= amount;
            await wallet.save();
            
            // send notification
            const message = new Notification({
                userId: wallet.userId,
                message: `Confirmed ${amount} Kes  withdrawn from  ${wallet.walletAccountNumber} ${wallet.name} on ${new Date()}`,
                timestamp: new Date()

            })
            await message.save();

            sendSMSNotification("254717064174", message.message);

            return { success: true, newBalance: wallet.balance };
        } catch (error) {
            console.error('Error withdrawing funds:', error);
            throw new Error("Internal server error");
        }
    }



}

export default WalletService;


