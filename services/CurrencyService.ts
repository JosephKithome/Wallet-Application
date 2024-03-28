import jwt from 'jsonwebtoken';
import { Request } from 'express';
import { Currency } from '../models/schema';

class CurrencyService {
    async createCurrency(req: Request): Promise<{ success: boolean; currency?: any; error?: string }> {
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

             // Check if the token has expired
             if (payload.expiresAt && payload.expiresAt < Math.floor(Date.now() / 1000)) {
                return { success: false, error: "Token has expired" };
            }

            const userId = payload.subject;

            const { name, code, country } = req.body;

            if (!name || !code || !country) {
                return { success: false, error: 'Name, code, and country cannot be empty' };
            }

            const existingCurrency = await Currency.findOne({ code: code });

            if (existingCurrency) {
                return { success: false, error: 'Currency already exists' };
            }

            const newCurrency = new Currency({
                name: name,
                code: code,
                country: country
            });

            await newCurrency.save();

            return { success: true, currency: newCurrency };
        } catch (error) {
            console.error('Error creating currency:', error);
            throw new Error("An unexpected error occurred");
        }
    }

    async getCurrencies(req: Request): Promise<{ success: boolean; currencies?: any[]; error?: string }> {
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

            // Check if the token has expired
            if (payload.expiresAt && payload.expiresAt < Math.floor(Date.now() / 1000)) {
                return { success: false, error: "Token has expired" };
            }


            // Extract userId from payload
            const userId = payload.subject;

            // Query the database to find all currencies
            const currencies = await Currency.find();

            return { success: true, currencies };
        } catch (error) {
            console.error('Error fetching currencies:', error);
            throw new Error("An unexpected error occurred");
        }
    }
}

export default CurrencyService;
