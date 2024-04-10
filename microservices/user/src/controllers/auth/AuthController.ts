import { Request, Response } from 'express';
import AuthService from '../../services/AuthService';


export class AuthController {
    async signUp(req: Request, resp: Response) {
        try {
            const userData = req.body;
            const authService = new AuthService();
            const result = await authService.registerUser(userData);
            if (result.success) {
                resp.status(200).json({ message: result.message });
            } else {
                resp.status(400).json({ error: result.message });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).send("Error occurred while registering user.");
        }
    }
    async login(req: Request, resp: Response) {
        try {
            const userData = req.body;
            const authService = new AuthService();
            const result = await authService.loginUser(userData);
            if (result.success) {
                resp.status(200).json({ token: result.token });
            } else {
                resp.status(401).json({ error: result.error });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).send("Internal Server Error");
        }
    }

    async resetPassword(req: Request, resp: Response) {
        try {

            const authService = new AuthService();

            const token = req.headers.authorization?.split(' ')[1];

            const result = await authService.resetPassword(req, token || '');

            if (result.success) {
                resp.status(201).json({ message: 'Password changed successfully', wallet: result.user });
            } else {
                resp.status(400).json({ error: result.error });
            }
        } catch (error) {
            resp.status(500).json({ error: 'An unexpected error occurred' });
        }

    }
    }
  


