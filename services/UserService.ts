import jwt from 'jsonwebtoken';
import { User } from '../models/schema';
import { CustomLogger } from '../utils/logger';

class UserService {

    private logger = new CustomLogger();

    async getUserById(userId: string, token: string): Promise<{ success: boolean; user?: any; error?: string }> {

        this.logger.logInfo('getUserById', userId);

        try {
            // Check if the token is null or missing
            if (!token || token === "null") {
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

            // Validate if user ID was provided
            if (!userId) {
                return { success: false, error: "Please provide a valid user ID" };
            }

            // Find user by ID
            const user = await User.findById(userId).populate('Wallet');
            if (!user) {
                return { success: false, error: "User not found" };
            }

            return { success: true, user };
        } catch (error: any) {
            this.logger.logError('Error fetching user:', error.message);
            throw new Error("Internal server error");
        }
    }

    async updateUserProfile(userId: string, userData: any, token: string): Promise<{ success: boolean; updatedUser?: any; error?: string }> {

        this.logger.logInfo("updateUserProfile', userId: " + userId);

        try {
            // Check if the token is null or missing
            if (!token || token === "null") {
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

            // Validate if user ID was provided
            if (!userId) {
                return { success: false, error: "Please provide a valid user ID" };
            }

            // Find user by ID and update
            const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });
            if (!updatedUser) {
                return { success: false, error: "User not found" };
            }

            return { success: true, updatedUser };
        } catch (error: any) {
            this.logger.logError('Error updating user profile', error.message.toString());
            return { success: false, error: "Error updating user profile" };
        }
    }
}

export default UserService;
