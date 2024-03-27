import { Request, Response } from 'express';
import BankService from '../../service/BankServie';

export class BankController {
    async createBankAccount(req: Request, resp: Response) {
        try {
            const bankService = new BankService();
            const result = await bankService.createBankAccount(req);

            if (result.success) {
                resp.status(201).json({ message: 'Bank account created successfully', bankAccount: result.bankAccount });
            } else {
                resp.status(400).json({ error: result.error });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).json({ error: 'Internal server error' });
        }
    }
}

