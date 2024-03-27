import { Request, Response } from 'express';
import CurrencyService from '../../service/CurrencyService';

export class CurrencyController {
    async createCurrency(req: Request, resp: Response) {
        try {
            const currencyService = new CurrencyService();
            const result = await currencyService.createCurrency(req);

            if (result.success) {
                resp.status(201).json({ message: 'Currency created successfully', currency: result.currency });
            } else {
                resp.status(400).json({ error: result.error });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).json({ error: 'Internal server error' });
        }
    }

    async getCurrencies(req: Request, resp: Response) {
        try {
            const currencyService = new CurrencyService();
            const result = await currencyService.getCurrencies(req);

            if (result.success) {
                resp.status(200).json({ message: 'Success', currencies: result.currencies });
            } else {
                resp.status(400).json({ error: result.error });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).json({ error: 'Internal server error' });
        }
    }
}

