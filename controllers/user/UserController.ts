import { Request, Response } from 'express';
import UserService from '../../services/UserService';

export class UserController {
    async getUserById(req: Request, resp: Response) {
        try {
            const userId = req.params.userId;
            const token = req.headers.authorization?.split(' ')[1];
            
            const userService = new UserService();
            const result = await userService.getUserById(userId, token || '');

            if (result.success) {
                resp.json(result.user);
            } else {
                resp.status(401).json({ error: result.error });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).json({ message: 'Internal server error' });
        }
    }

    async updateUserProfile(req: Request, resp: Response) {
        try {
            const userId = req.params.userId;
            const userData = req.body;
            const token = req.headers.authorization?.split(' ')[1];
            
            const userService = new UserService();
            const result = await userService.updateUserProfile(userId, userData, token || '');

            if (result.success) {
                resp.json(result.updatedUser);
            } else {
                resp.status(401).json({ error: result.error });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).json({ message: 'Internal server error' });
        }
    }
}