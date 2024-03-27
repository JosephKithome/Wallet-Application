import { Request, Response } from 'express';
import WalletService from '../../service/WalletService';

export class WalletControlller {
    async createWallet(req: Request, resp: Response) {
        try {

            const walletService = new WalletService();

            const token = req.headers.authorization?.split(' ')[1];

            const result = await walletService.createWallet(req, token || '');

            if (result.success) {
                resp.status(201).json({ message: 'Wallet created successfully', wallet: result.wallet });
            } else {
                resp.status(400).json({ error: result.error });
            }
        } catch (error) {
            resp.status(500).json({ error: 'An unexpected error occurred' });
        }

    }

    async creditWallet(req: Request, resp: Response) {
        try {

            const walletService = new WalletService();

            const token = req.headers.authorization?.split(' ')[1];

            const result = await walletService.creditWallet(req, token || '');

            if (result.success) {
                resp.status(201).json({ message: 'Wallet credited successfully', wallet: result.wallet });
            } else {
                resp.status(400).json({ error: result.error });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).json({ error: 'An unexpected error occurred' });
        }

    }
    async getWalletbyName(req: Request, resp: Response) {
        try {

            const walletService = new WalletService();

            const token = req.headers.authorization?.split(' ')[1];

            const result = await walletService.getWalletByName(req, token || '');

            if (result.success) {
                resp.status(201).json({ message: 'Success', wallet: result.wallet });
            } else {
                resp.status(400).json({ error: result.error });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
    
     async debitWallet(req: Request, resp: Response) {
        try {
            const walletService = new WalletService();
            const result = await walletService.debitWallet(req);

            if (result.success) {
                resp.status(200).json({ message: 'Wallet debited successfully', wallet: result.wallet });
            } else {
                resp.status(400).json({ error: result.error });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).json({ error: 'An unexpected error occurred' });
        }
    }

    async getWalletBalance(req: Request, resp: Response) {
        try {
            const walletService = new WalletService();
            const result = await walletService.getWalletBalance(req);

            if (result.success) {
                resp.status(200).json({ message: 'Success', wallet: result.wallet });
            } else {
                resp.status(400).json({ error: result.error });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).json({ error: 'An unexpected error occurred' });
        }
    }

    async withdrawFunds(req: Request, resp: Response) {
        try {
            const withdrawalService = new WalletService();
            const result = await withdrawalService.withdrawFunds(req);

            if (result.success) {
                resp.json({ message: 'Withdrawal successful', newBalance: result.newBalance });
            } else {
                resp.status(400).json({ error: result.error });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).json({ error: 'Internal server error' });
        }
    }
}