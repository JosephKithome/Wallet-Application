import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import jwt, { JwtPayload } from 'jsonwebtoken';
import swaggerUi from 'swagger-ui-express';
import { dbConection } from './database/mongoConnector';
import {
    Transaction,
    User,
    Wallet
} from './models/schema';
import { swaggerDocument } from './documentation/swagger';
import bcrypt from 'bcrypt';
import {
    accountNumberGenerator,
    getWalletExpiryDate
} from './utils/utils';

export const app: Application = express();

// Middleware
app.use(bodyParser.json());

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

// Register endpoint
app.post("/api/user/signup", async (req: Request, resp: Response) => {
    try {
        const userData = req.body;
        const user = new User(userData);

        // check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            return resp.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        user.password = hashedPassword
        const registeredUser = await user.save();

        // Generate a token for the user
        const payload = { subject: registeredUser._id };
        const token = jwt.sign(payload, 'secretkey');
        if (token !== "") {
            resp.status(200).json({ message: 'User registered successfully' });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Error occurred while registering user.");
    }
});

// Login endpoint
app.post("/api/user/login", (req: Request, resp: Response) => {
    const userData = req.body;

    User.findOne({ email: userData.email })
        .then((dbUser: any) => {
            if (!dbUser) {
                resp.status(401).send("Invalid Email");
                return;
            }

            if (dbUser.password !== userData.password) {
                resp.status(401).send("Invalid password");
                return;
            }

            const payload = { subject: dbUser._id };
            const token = jwt.sign(payload, `${process.env.SECRET_KEY}`);
            resp.status(200).send({ token });
        })
        .catch((error: any) => {
            console.log(error);
            resp.status(500).send("Internal Server Error");
        });
});

//Get user details by user ID
app.get('/api/user/:userId', async (req, resp) => {
    const userId = req.params.userId;
    try {
        // Check if the authorization header is missing
        if (!req.headers.authorization) {
            return resp.status(401).send("Unauthorized request!!");
        }

        // Extract token from the authorization header
        const token = req.headers.authorization.split(' ')[1];

        // Check if the token is null
        if (token === "null") {
            return resp.status(401).send("Unauthorized");
        }

        let payload: string | JwtPayload;

        try {
            // Verify the token
            payload = jwt.verify(token, `${process.env.SECRET_KEY}`) as JwtPayload;
        } catch (error) {
            return resp.status(401).send("Unauthorized");
        }

        // Check if payload is valid
        if (!payload || typeof payload === 'string') {
            return resp.status(401).send("Unauthorized");
        }

        const user = await User.findById(userId);
        if (!user) {
            return resp.status(404).json({ message: 'User not found' });
        }
        resp.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        resp.status(500).json({ message: 'Internal server error' });
    }

});

// update user profile
app.put('/api/user/:userId', async (req, resp) => {
    const userId = req.params.userId;
    const userData = req.body;
    try {
        // Check if the authorization header is missing
        if (!req.headers.authorization) {
            return resp.status(401).send("Unauthorized request!!");
        }

        // Extract token from the authorization header
        const token = req.headers.authorization.split(' ')[1];

        // Check if the token is null
        if (token === "null") {
            return resp.status(401).send("Unauthorized");
        }

        let payload: string | JwtPayload;

        try {
            // Verify the token
            payload = jwt.verify(token, `${process.env.SECRET_KEY}`) as JwtPayload;
        } catch (error) {
            return resp.status(401).send("Unauthorized");
        }

        // Check if payload is valid
        if (!payload || typeof payload === 'string') {
            return resp.status(401).send("Unauthorized");
        }

        const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });
        if (!updatedUser) {
            return resp.status(404).json({ message: 'User not found' });
        }
        resp.json(updatedUser);
    } catch (error) {
        console.error('Error updating user profile:', error);
        resp.status(500).json({ message: 'Internal server error' });
    }

});
// Create Wallet account
app.post('/wallet', async (req: Request, resp: Response) => {
    try {
        // Check if the authorization header is missing
        if (!req.headers.authorization) {
            return resp.status(401).send("Unauthorized request!!");
        }

        // Extract token from the authorization header
        const token = req.headers.authorization.split(' ')[1];

        // Check if the token is null
        if (token === "null") {
            return resp.status(401).send("Unauthorized");
        }

        let payload: string | JwtPayload;

        try {
            // Verify the token
            payload = jwt.verify(token, `${process.env.SECRET_KEY}`) as JwtPayload;
        } catch (error) {
            return resp.status(401).send("Unauthorized");
        }

        // Check if payload is valid
        if (!payload || typeof payload === 'string') {
            return resp.status(401).send("Unauthorized");
        }

        // Extract userId from payload
        const userId = payload.subject;

        // Check if the user already has a wallet
        const existingWallet = await Wallet.findOne({ userId: userId });
        if (existingWallet) {
            return resp.status(400).json({ error: 'User already has a wallet' });
        }

        // Create a new wallet for the user
        const newWallet = new Wallet({
            userId: userId,
            balance: 0,
            walletAccountNumber: accountNumberGenerator().toString(),
            expiresAt: getWalletExpiryDate()
        });
        await newWallet.save();

        resp.status(201).json({ message: 'Wallet created successfully', wallet: newWallet });
    } catch (error) {
        console.error('Error creating wallet:', error);
        resp.status(500).json({ error: 'An unexpected error occurred' });
    }
});

app.post('/wallet/credit', async (req: Request, resp: Response) => {
    try {
        // Check if the authorization header is missing
        if (!req.headers.authorization) {
            return resp.status(401).send("Unauthorized request!!");
        }

        // Extract token from the authorization header
        const token = req.headers.authorization.split(' ')[1];

        // Check if the token is null
        if (token === "null") {
            return resp.status(401).send("Unauthorized");
        }

        let payload: string | JwtPayload;

        try {
            // Verify the token
            payload = jwt.verify(token, `${process.env.SECRET_KEY}`) as JwtPayload;
        } catch (error) {
            return resp.status(401).send("Unauthorized");
        }

        // Check if payload is valid
        if (!payload || typeof payload === 'string') {
            return resp.status(401).send("Unauthorized");
        }

        // Extract userId from payload
        const userId = payload.subject;

        // Check if the user has a wallet
        const wallet = await Wallet.findOne({ userId: userId });
        if (!wallet) {
            return resp.status(404).json({ error: 'Wallet not found' });
        }

        // Extract the amount to credit from the request body
        const { amount } = req.body;

        // Validate the amount
        if (typeof amount !== 'number' || amount <= 0) {
            return resp.status(400).json({ error: 'Invalid amount' });
        }

        // Update wallet balance
        wallet.balance += amount;
        await wallet.save();
        //Also save the transaction for tracking purposes
        const transaction = {
            senderId: userId,
            amount: amount,
            type: 'credit'
        };
        await Transaction.create(transaction);

        resp.status(200).json({ message: 'Wallet credited successfully', wallet });
    } catch (error) {
        console.error('Error crediting wallet:', error);
        resp.status(500).json({ error: 'An unexpected error occurred' });
    }
});

app.get('/wallet/balance', async (req: Request, resp: Response) => {
    try {
        // Check if the authorization header is missing
        if (!req.headers.authorization) {
            return resp.status(401).send("Unauthorized request!!");
        }

        // Extract token from the authorization header
        const token = req.headers.authorization.split(' ')[1];

        // Check if the token is null
        if (token === "null") {
            return resp.status(401).send("Unauthorized");
        }

        let payload: string | JwtPayload;

        try {
            // Verify the token
            payload = jwt.verify(token, `${process.env.SECRET_KEY}`) as JwtPayload;
        } catch (error) {
            return resp.status(401).send("Unauthorized");
        }

        // Check if payload is valid
        if (!payload || typeof payload === 'string') {
            return resp.status(401).send("Unauthorized");
        }

        const userId = payload.subject;
        // Check if the user has a wallet
        const { walletAccountNumber } = req.body
        const wallet = await Wallet.findOne({ walletAccountNumber: walletAccountNumber });
        if (!wallet) {
            return resp.status(404).json({ error: 'Wallet not found' });
        }

        resp.status(200).json({ message: 'Success', wallet });
    } catch (error) {
        console.error('Error fetching wallet balance :', error);
        resp.status(500).json({ error: 'An unexpected error occurred' });
    }
});

app.post('/wallet/debit', async (req: Request, resp: Response) => {
    try {
        // Check if the authorization header is missing
        if (!req.headers.authorization) {
            return resp.status(401).send("Unauthorized request!!");
        }

        // Extract token from the authorization header
        const token = req.headers.authorization.split(' ')[1];

        // Check if the token is null
        if (token === "null") {
            return resp.status(401).send("Unauthorized");
        }

        let payload: string | JwtPayload;

        try {
            // Verify the token
            payload = jwt.verify(token, `${process.env.SECRET_KEY}`) as JwtPayload;
        } catch (error) {
            return resp.status(401).send("Unauthorized");
        }

        // Check if payload is valid
        if (!payload || typeof payload === 'string') {
            return resp.status(401).send("Unauthorized");
        }

        // Extract userId from payload
        const userId = payload.subject;

        // Check if the user has a wallet
        const wallet = await Wallet.findOne({ userId: userId });
        if (!wallet) {
            return resp.status(404).json({ error: 'Wallet not found' });
        }

        // Extract the amount to credit from the request body
        const { amount, walletAccountNumber } = req.body;

        const receiver = await Wallet.findOne({ walletAccountNumber: walletAccountNumber })
        if (!receiver) {
            return resp.status(404).json({ error: 'Wallet not found' });
        }

        // Validate the amount
        if (typeof amount !== 'number' || amount <= 0) {
            return resp.status(400).json({ error: 'Invalid amount' });
        }

        // validate if the sending amount is more than the amount in the amount account
        if (amount > wallet.balance) {
            return resp.status(400).json({ error: 'Insufficient funds' });
        }
        receiver.balance += amount;
        await receiver.save();
        //Also save the transaction for tracking purposes
        const tr = {
            senderId: userId,
            amount: amount,
            type: 'credit'
        };

        await Transaction.create(tr);

        // Update wallet balance
        wallet.balance -= amount;
        await wallet.save();

        // Credit  the receiver Wallet Account

        //Also save the transaction for tracking purposes
        const transaction = {
            senderId: userId,
            receiverWalletAccountNumber: receiver.walletAccountNumber,
            amount: amount,
            type: 'debit'
        };
        await Transaction.create(transaction);

        resp.status(200).json({ message: 'Wallet debited successfully', wallet });
    } catch (error) {
        console.error('Error crediting wallet:', error);
        resp.status(500).json({ error: 'An unexpected error occurred' });
    }
});


// Define route for sending funds
app.post('/api/transaction/send', async (req, resp) => {
    const { amount, receiverAccountNumber } = req.body;
    try {
        // Check if the authorization header is missing
        if (!req.headers.authorization) {
            return resp.status(401).send("Unauthorized request!!");
        }

        // Extract token from the authorization header
        const token = req.headers.authorization.split(' ')[1];

        // Check if the token is null
        if (token === "null") {
            return resp.status(401).send("Unauthorized");
        }

        let payload: string | JwtPayload;

        try {
            // Verify the token
            payload = jwt.verify(token, `${process.env.SECRET_KEY}`) as JwtPayload;
        } catch (error) {
            return resp.status(401).send("Unauthorized");
        }

        // Check if payload is valid
        if (!payload || typeof payload === 'string') {
            return resp.status(401).send("Unauthorized");
        }

        // Extract userId from payload
        const userId = payload.subject;

        // Check if the user has a wallet
        const wallet = await Wallet.findOne({ userId: userId });
        if (!wallet) {
            return resp.status(404).json({ error: 'Wallet for user not found' });
        }

        // Validate the amount
        if (typeof amount !== 'number' || amount <= 0) {
            return resp.status(400).json({ error: 'Invalid amount' });
        }

        // validate if the sending amount is more than the amount in the amount account
        if (amount > wallet.balance) {
            return resp.status(400).json({ error: 'Insufficient funds' });
        }
        // find the receivers account number 
        const receiver = await Wallet.findOne({ walletAccountNumber: receiverAccountNumber });
        if (!receiver) {
            return resp.status(404).json({ error: 'Receiver\'s Wallet not found' });
        }
        // Credit the receiver's account
        receiver.balance += amount;
        await receiver.save();

        // debit the  sender's account
        wallet.balance -= amount;
        await wallet.save();

        // Create transaction record
        const transaction = new Transaction({
            senderId: wallet.userId,
            receiverId: receiver.userId,
            amount: amount,
            walletAccountNumber: wallet.walletAccountNumber,
            type: 'debit',
        });
        await transaction.save();

        const tr = new Transaction({
            senderId: receiver.userId,
            receiverId: wallet.userId,
            amount: amount,
            walletAccountNumber: receiver.walletAccountNumber,
            type: 'credit',
        });
        await tr.save();

        //Trigger Notification here

        resp.json({ message: 'Funds sent successfully' });
    } catch (error) {
        console.error('Error sending funds:', error);
        resp.status(500).json({ message: 'Internal server error' });
    }
});

// Define route for withdrawing funds from user's wallet
app.post('/api/users/:userId/wallet/withdraw', async (req, resp) => {
    const { amount } = req.body;
    try {

        // Check if the authorization header is missing
        if (!req.headers.authorization) {
            return resp.status(401).send("Unauthorized request!!");
        }

        // Extract token from the authorization header
        const token = req.headers.authorization.split(' ')[1];

        // Check if the token is null
        if (token === "null") {
            return resp.status(401).send("Unauthorized");
        }

        let payload: string | JwtPayload;

        try {
            // Verify the token
            payload = jwt.verify(token, `${process.env.SECRET_KEY}`) as JwtPayload;
        } catch (error) {
            return resp.status(401).send("Unauthorized");
        }

        // Check if payload is valid
        if (!payload || typeof payload === 'string') {
            return resp.status(401).send("Unauthorized");
        }

        // Extract userId from payload
        const userId = payload.subject;

        if (userId !== req.params.userId) {
            return resp.status(404).json({ message: 'You can only withdraw from your own account' });
        }
        // Find the user's wallet
        const wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            return resp.status(404).json({ message: 'Wallet not found' });
        }

        // Check if there are sufficient funds
        if (wallet.balance < amount) {
            return resp.status(400).json({ message: 'Insufficient funds' });
        }

        // Update the wallet balance after withdrawal
        wallet.balance -= amount;
        await wallet.save();

        resp.json({ message: 'Withdrawal successful', newBalance: wallet.balance });
    } catch (error) {
        console.error('Error withdrawing funds:', error);
        resp.status(500).json({ message: 'Internal server error' });
    }
});

// Define route for getting transaction history for user's wallet
app.get('/api/users/:userId/wallet/transactions', async (req, resp) => {
    try {
        // Check if the authorization header is missing
        if (!req.headers.authorization) {
            return resp.status(401).send("Unauthorized request!!");
        }

        // Extract token from the authorization header
        const token = req.headers.authorization.split(' ')[1];

        // Check if the token is null
        if (token === "null") {
            return resp.status(401).send("Unauthorized");
        }

        let payload: string | JwtPayload;

        try {
            // Verify the token
            payload = jwt.verify(token, `${process.env.SECRET_KEY}`) as JwtPayload;
        } catch (error) {
            return resp.status(401).send("Unauthorized");
        }

        // Check if payload is valid
        if (!payload || typeof payload === 'string') {
            return resp.status(401).send("Unauthorized");
        }

        // Extract userId from payload
        const userId = payload.subject;
        // Find transactions where the user is either sender or receiver
        const transactions = await Transaction.find({
            $or: [{ senderId: userId }, { receiverId: userId }],
        }).sort({ timestamp: -1 }); // Sort by timestamp in descending order
        resp.json(transactions);
    } catch (error) {
        console.error('Error fetching wallet transactions:', error);
        resp.status(500).json({ message: 'Internal server error' });
    }
});

// Define the route
app.get('/api/transaction/wallet/:walletId', async (req, resp) => {
    try {

        // Check if the authorization header is missing
        if (!req.headers.authorization) {
            return resp.status(401).send("Unauthorized request!!");
        }

        // Extract token from the authorization header
        const token = req.headers.authorization.split(' ')[1];

        // Check if the token is null
        if (token === "null") {
            return resp.status(401).send("Unauthorized");
        }

        let payload: string | JwtPayload;

        try {
            // Verify the token
            payload = jwt.verify(token, `${process.env.SECRET_KEY}`) as JwtPayload;
        } catch (error) {
            return resp.status(401).send("Unauthorized");
        }

        // Check if payload is valid
        if (!payload || typeof payload === 'string') {
            return resp.status(401).send("Unauthorized");
        }

        // Extract userId from payload
        const userId = payload.subject;

        // Retrieve the walletId from request parameters
        const { walletId } = req.params;

        // Query the database to find all transactions associated with the given walletId
        const transactions = await Transaction.find({  });
        // Send the list of transactions as the HTTP response
        resp.status(200).json({ transactions });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        resp.status(500).json({ error: 'Internal server error' });
    }
})

// Server start
const PORT: number = 4000;

function runServer() {
    try {
        dbConection();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.error(e);
    }
}

runServer();