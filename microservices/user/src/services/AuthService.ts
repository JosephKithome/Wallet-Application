import { User } from '../models/schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CustomLogger } from '../utils/logger';

class AuthService {

    private logger = new CustomLogger();

    async registerUser(userData: any) {
        try {
            // Validate the incoming user data
            if (userData.email === undefined || userData.email === "") {
                return { success: false, message: 'Please provide a valid email' };
            }
            if (userData.password === "") {
                return { success: false, message: 'Please provide a valid password' };
            }
            if (userData.password.length < 8) {
                return { success: false, message: 'Password must be at least 8 characters long' };
            }
            if (userData.firstName == null || userData.firstName == undefined || userData.lastName == null || userData.lastName == undefined) {
                return { success: false, message: 'Please provide a valid first and last name' };
            }
            if (userData.phone == "" || userData.phone == undefined) {
                return { success: false, message: 'Please provide a valid phone number' };
            }

            // Check if user already exists
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                return { success: false, message: 'User already exists' };
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(userData.password, 12);
            userData.password = hashedPassword;

            // Save the user to the database
            const user = new User(userData);
            const registeredUser = await user.save();

            // Generate a token for the user
            const payload = { subject: registeredUser._id };
            
            const token = jwt.sign(payload, 'secretkey');

            return { success: true, message: 'User registered successfully' };
        } catch (error) {
            console.error(error);
            throw new Error("Error occurred while registering user.");
        }
    }

    async loginUser(userData: any): Promise<{ success: boolean; token?: string; error?: string }> {
        try {
            // Validate the incoming user data
            if (userData.email === "" || userData.password === "") {
                return { success: false, error: 'Please provide a valid email and password' };
            }
            if (userData.password.length < 8) {
                return { success: false, error: 'Password must be at least 8 characters long' };
            }

            // Find user by email
            const dbUser = await User.findOne({ email: userData.email });
            if (!dbUser) {
                return { success: false, error: 'Invalid Email' };
            }

            // Check password
            const passwordMatch = await bcrypt.compare(userData.password, dbUser.password);
            if (!passwordMatch) {
                return { success: false, error: 'Invalid password' };
            }

            // Generate token
            const payload = { subject: dbUser._id,  expiresAt: new Date(Date.now() + (1 * 60 * 60 * 1000))};
            const token = jwt.sign(payload, `${process.env.SECRET_KEY}`);
            return { success: true, token };
        } catch (error) {
            console.error(error);
            throw new Error("Internal Server Error");
        }
    }
    async resetPassword(req: any, token: string): Promise<{ success: boolean; user?: any; error?: string }> {
        
        this.logger.logInfo('Reseting  payload: ' + req.body);

        try {

            const { oldPassword, newPassword } = req.body;

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

            this.logger.logInfo("UserID: " + userId);

            // Check if the user already has a wallet
            const existingUser = await User.findOne({ userId: userId });
            if (!existingUser) {

                return { success: false, error: "No user Found!" };
            }else{
                const hashedPassword = await bcrypt.hash(newPassword, 12);
                existingUser.password = hashedPassword
                existingUser.save();
                return { success: false, error: "Password changed successfully" };
            }
        } catch (error: any) {
            this.logger.logError('Error changing password:', error.message.toString());
            return { success: false, error: "Error when changing password" };
        }
    }

    logout = async () =>{

    }
}

export default AuthService;
