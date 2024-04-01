import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { Wallet,Transaction,Notification } from '../models/schema';
import { sendSMSNotification } from '../integrations/sms';
import { CustomLogger } from '../utils/logger';

class TransactionService {
    private logger = new CustomLogger();

    async sendFunds(req: Request): Promise<{ success: boolean; newBalance?: number; error?: string }> {

        this.logger.logInfo("SendFunds" + JSON.stringify(req.body));
        
        try {
            const { amount, receiverAccountNumber } = req.body;

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

            if (receiverAccountNumber === null || receiverAccountNumber === undefined) {
                return { success: false, error: "Receiver account number cannot be empty" };
            }

            if (typeof amount !== 'number' || amount <= 0) {
                return { success: false, error: "Invalid amount" };
            }

            const wallet = await Wallet.findOne({ userId });

            if (!wallet) {
                return { success: false, error: "Wallet for user not found" };
            }

            if (amount > wallet.balance) {
                return { success: false, error: "Insufficient funds" };
            }

            const receiver = await Wallet.findOne({ walletAccountNumber: receiverAccountNumber });

            if (!receiver) {
                return { success: false, error: "Receiver's Wallet not found" };
            }

            receiver.balance += amount;
            await receiver.save();

            wallet.balance -= amount;
            await wallet.save();

            const transaction = new Transaction({
                senderId: wallet.userId,
                receiverId: receiver.userId,
                amount,
                walletAccountNumber: wallet.walletAccountNumber,
                name: wallet.name,
                type: 'debit',
            });
            transaction.save();

            const message = new Notification({
                userId: wallet.userId,
                message: `Confirmed ${amount} Kes send to ${receiver.walletAccountNumber} ${wallet.name} on ${new Date()}`,
                timestamp: new Date()
            });

            await message.save();

            // Trigger notification here
            // sendSMSNotification("254717064174", message.message);

            const tr = new Transaction({
                senderId: receiver.userId,
                receiverId: wallet.userId,
                amount,
                walletAccountNumber: receiver.walletAccountNumber,
                name: receiver.name,
                type: 'credit',
            });

            await tr.save();

            const msg = new Notification({
                userId: wallet.userId,
                message: `You have received ${amount} from ${receiver.walletAccountNumber}`,
                timestamp: new Date()
            });

            await msg.save();

            return { success: true, newBalance: wallet.balance };
        } catch (error: any) {
            this.logger.logError('Error sending funds', error.message);
            throw new Error("Internal server error");
        }
    }
    async getWalletTransactions(req: Request): Promise<{ success: boolean; transactions?: any[]; error?: string }> {

        this.logger.logInfo("getWalletTransactions" + req);

        try {
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

            const { user, walletId} = req.body

            const transactions = await Transaction.find({
                $or: [{ senderId: userId }, { receiverId: userId }],
            }).sort({ timestamp: -1 });

            return { success: true, transactions };
        } catch (error:any) {
            this.logger.logError('Error getting wallet transactions', error.message);
            throw new Error("Internal server error");
        }
    }

    async getTransactionsByWalletId(req: Request): Promise<{ success: boolean; transactions?: any[]; error?: string }> {

        this.logger.logInfo("getTransactionsByWalletId"+ req.params.walletId);

        try {
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

            const { walletId } = req.params;

            // Query the database to find all transactions associated with the given walletId
            const transactions = await Transaction.find({ walletAccountNumber: walletId });

            return { success: true, transactions };
        } catch (error: any) {
            this.logger.logError('Error fetching transactions:', error.message.toString());
            throw new Error("Internal server error");
        }
    }
}

export default TransactionService;
