import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { sendSMSNotification } from '../integrations/sms';
import { Wallet, Notification, Transaction, Currency } from '../models/schema';
import { WalletHelper } from './../utils/utils';
import { CustomLogger } from '../utils/logger';


class WalletService {

    private helper = new WalletHelper();
    private logger = new CustomLogger();
    private transactionLock: boolean;
    
    constructor() {
        this.transactionLock = false;
    }


    async createWallet(walletData: any, token: string): Promise<{ success: boolean; wallet?: any; error?: string }> {
        
        this.logger.logInfo('createWallet payload: ' + walletData);

        try {

            const { name, openedAt, expiresAt, isSuspended, balance, currency } = walletData.body;

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
             // Check if the token has expired
             if (payload.expiresAt && payload.expiresAt < Math.floor(Date.now() / 1000)) {
                return { success: false, error: "Token has expired" };
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
            // check whether the currency provided exists 
            const currencyExists = await Currency.findOne({ code: currency });
            if (!currencyExists) {
                return { success: false, error: "Currency not found" };
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
                walletAccountNumber: this.helper.accountNumberGenerator(),
                expiresAt: this.helper.getWalletExpiryDate(),
                currency: currencyExists._id
            });
            await newWallet.save();

            return { success: true, wallet: newWallet };
        } catch (error: any) {
            this.logger.logError('Error creating wallet:', error.message.toString());
            return { success: false, error: "Error when creating a wallet" };
        }
    }
    async debitWallet(req: Request): Promise<{ success: boolean; wallet?: any; error?: string }> {
        this.logger.logInfo("debitWallet', req: " + req);

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

            // Check if the token has expired
            if (payload.expiresAt && payload.expiresAt < Math.floor(Date.now() / 1000)) {
                return { success: false, error: "Token has expired" };
            }

            const userId = payload.subject;

            if (!walletAccountNumber) {
                return { success: false, error: "Account number cannot be empty" };
            }

            if (typeof amount !== 'number' || amount <= 0) {
                return { success: false, error: "Invalid amount" };
            }

            // Acquire lock to prevent concurrent transactions
            if (this.transactionLock) {
                return { success: false, error: "Another transaction is in progress. Please try again later." };
            }
            this.transactionLock = true;

            const wallet = await Wallet.findOne({ userId });

            if (!wallet) {
                this.transactionLock = false;
                return { success: false, error: "Wallet not found" };
            }

            const receiver = await Wallet.findOne({ walletAccountNumber });

            if (!receiver) {
                this.transactionLock = false;
                return { success: false, error: "Receiver wallet not found" };
            }

            if (amount > wallet.balance) {
                this.transactionLock = false;
                return { success: false, error: "Insufficient funds" };
            }

            // Simulate transaction delay
            await this.delay(1000);

            // Update receiver's balance
            receiver.balance += amount;
            await receiver.save();

            // Create sender's transaction
            const senderTransaction = await Transaction.create({
                senderId: userId,
                amount,
                type: 'debit',
                walletAccountNumber: wallet.walletAccountNumber
            });
            senderTransaction.save();

            // Update sender's balance
            wallet.balance -= amount;
            await wallet.save();

            // Create receiver's transaction
            const receiverTransaction = await Transaction.create({
                senderId: userId,
                walletAccountNumber: receiver.walletAccountNumber,
                amount,
                type: 'credit'
            });
            receiverTransaction.save();

            // Send notification to sender
            const senderMessage = new Notification({
                userId: wallet.userId,
                message: `Confirmed ${amount} Kes debited from ${wallet.walletAccountNumber} ${wallet.name} on ${new Date()}`,
                timestamp: new Date()
            });
            await senderMessage.save();
            // sendSMSNotification("254717064174", senderMessage.message);

            // Send notification to receiver
            const receiverMessage = new Notification({
                userId: wallet.userId,
                message: `Congratulations ${amount} Kes credited to ${receiver.walletAccountNumber} ${wallet.name} on ${new Date()}`,
                timestamp: new Date()
            });
            await receiverMessage.save();
            // sendSMSNotification("254717064174", receiverMessage.message);

            // Release lock
            this.transactionLock = false;

            return { success: true, wallet };
        } catch (error: any) {
            this.logger.logError('Error debiting wallet:', error.message.toString());
            throw new Error("An unexpected error occurred");
        }
    }

    // Simulate delay
    async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getWalletBalance(req: Request): Promise<{ success: boolean; wallet?: any; error?: string }> {

        this.logger.logInfo("getWalletBalance', req: " + req);

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
             // Check if the token has expired
             if (payload.expiresAt && payload.expiresAt < Math.floor(Date.now() / 1000)) {
                return { success: false, error: "Token has expired" };
            }

            const userId = payload.subject;

            if (walletAccountNumber == "" || walletAccountNumber === undefined) {
                return { success: false, error: "Account number cannot be empty" };
            }

            const wallet = await Wallet.findOne({ userId, walletAccountNumber });

            if (!wallet) {
                return { success: false, error: "Wallet not found" };
            }

            return { success: true, wallet };
        } catch (error: any) {
            this.logger.logError('Error while getting wallet balance', error.messae.toString());
            return { success: false, error: "An unexpected error occurred" };
        }
    }
    async getWalletByName(walletData: any, token: string): Promise<{ success: boolean; wallet?: any; error?: string }> {

        this.logger.logInfo("getWalletByName', walletData: " + walletData);

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
             // Check if the token has expired
             if (payload.expiresAt && payload.expiresAt < Math.floor(Date.now() / 1000)) {
                return { success: false, error: "Token has expired" };
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
        } catch (error: any) {
            this.logger.logDebug('Error while creating', error.message.toString());
            return { success: false, error: "Error retrieving a wallet" };
        }
    }

    async creditWallet(req: any, token: string): Promise<{ success: boolean; wallet?: any; error?: string }> {

        this.logger.logInfo("creditWallet', req: " + req);

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
             // Check if the token has expired
             if (payload.expiresAt && payload.expiresAt < Math.floor(Date.now() / 1000)) {
                return { success: false, error: "Token has expired" };
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
                type: 'credit',
                walletAccountNumber: wallet.walletAccountNumber
            });

            transaction.save();

            // send notification
            const message = new Notification({
                userId: wallet.userId,
                message: `Confirmed ${amount} Kes  deposited  to ${wallet.walletAccountNumber} ${wallet.name} on ${new Date()}`,
                timestamp: new Date()

            })
            await message.save();

            // sendSMSNotification("254717064174", message.message);

            return { success: true, wallet: wallet };
        } catch (error: any) {

            this.logger.logError('Error crediting wallet:', error.message.toString());
            return { success: false, error: "Error crediting a wallet" };
        }
    }

    async withdrawFunds(req: Request): Promise<{ success: boolean; newBalance?: number; error?: string }> {

        this.logger.logInfo("withdrawFunds', req: " + req);

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
             // Check if the token has expired
             if (payload.expiresAt && payload.expiresAt < Math.floor(Date.now() / 1000)) {
                return { success: false, error: "Token has expired" };
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

            // sendSMSNotification("254717064174", message.message);

            return { success: true, newBalance: wallet.balance };
        } catch (error: any) {

            this.logger.logError('Error withdrawing funds:', error.message.toString());
            throw new Error("Internal server error");
        }
    }



}

export default WalletService;


