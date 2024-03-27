import { Request, Response } from 'express';
import TransactionService from '../../services/TransactionsService';

export class TransactionController {
    async sendFunds(req: Request, resp: Response) {
        try {
            const transactionService = new TransactionService();
            const result = await transactionService.sendFunds(req);

            if (result.success) {
                resp.json({ message: 'Funds sent successfully', newBalance: result.newBalance });
            } else {
                resp.status(400).json({ error: result.error });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).json({ error: 'Internal server error' });
        }
    }

    async getWalletTransactions(req: Request, resp: Response) {
        try {
            const transactionService = new TransactionService();
            const result = await transactionService.getWalletTransactions(req);

            if (result.success) {
                resp.json(result.transactions);
            } else {
                resp.status(400).json({ error: result.error });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).json({ error: 'Internal server error' });
        }
    }
    async getTransactionsByWalletId(req: Request, resp: Response) {
        try {
            const transactionService = new TransactionService();
            const result = await transactionService.getTransactionsByWalletId(req);

            if (result.success) {
                resp.status(200).json({ transactions: result.transactions });
            } else {
                resp.status(401).json({ error: result.error });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).json({ error: 'Internal server error' });
        }
    }
}


