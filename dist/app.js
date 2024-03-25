"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const mongoConnector_1 = require("./database/mongoConnector");
const schema_1 = require("./models/schema");
const swagger_1 = require("./documentation/swagger");
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("./utils/utils");
exports.app = (0, express_1.default)();
// Middleware
exports.app.use(body_parser_1.default.json());
// Swagger setup
exports.app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerDocument));
// Routes
exports.app.get('/', (req, res) => {
    res.send('Welcome to Wallet Application');
});
// Register endpoint
exports.app.post("/api/v1/user/signup", (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.body;
        const user = new schema_1.User(userData);
        // check if user already exists
        const existingUser = yield schema_1.User.findOne({ email: userData.email });
        if (existingUser) {
            return resp.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(userData.password, 12);
        user.password = hashedPassword;
        const registeredUser = yield user.save();
        // Generate a token for the user
        const payload = { subject: registeredUser._id };
        const token = jsonwebtoken_1.default.sign(payload, 'secretkey');
        if (token !== "") {
            resp.status(200).json({ message: 'User registered successfully' });
        }
    }
    catch (error) {
        console.error(error);
        resp.status(500).send("Error occurred while registering user.");
    }
}));
// Login endpoint
exports.app.post("/api/v1/user/login", (req, resp) => {
    const userData = req.body;
    schema_1.User.findOne({ email: userData.email })
        .then((dbUser) => {
        if (!dbUser) {
            resp.status(401).send("Invalid Email");
            return;
        }
        if (dbUser.password !== userData.password) {
            resp.status(401).send("Invalid password");
            return;
        }
        const payload = { subject: dbUser._id };
        const token = jsonwebtoken_1.default.sign(payload, `${process.env.SECRET_KEY}`);
        resp.status(200).send({ token });
    })
        .catch((error) => {
        console.log(error);
        resp.status(500).send("Internal Server Error");
    });
});
//Get user details by user ID
exports.app.get('/api/v1/user/:userId', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
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
        let payload;
        try {
            // Verify the token
            payload = jsonwebtoken_1.default.verify(token, `${process.env.SECRET_KEY}`);
        }
        catch (error) {
            return resp.status(401).send("Unauthorized");
        }
        // Check if payload is valid
        if (!payload || typeof payload === 'string') {
            return resp.status(401).send("Unauthorized");
        }
        const user = yield schema_1.User.findById({ _id: userId });
        if (!user) {
            return resp.status(404).json({ message: 'User not found' });
        }
        resp.json(user);
    }
    catch (error) {
        console.error('Error fetching user:', error);
        resp.status(500).json({ message: 'Internal server error' });
    }
}));
// update user profile
exports.app.put('/api/v1/user/:userId', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
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
        let payload;
        try {
            // Verify the token
            payload = jsonwebtoken_1.default.verify(token, `${process.env.SECRET_KEY}`);
        }
        catch (error) {
            return resp.status(401).send("Unauthorized");
        }
        // Check if payload is valid
        if (!payload || typeof payload === 'string') {
            return resp.status(401).send("Unauthorized");
        }
        const updatedUser = yield schema_1.User.findByIdAndUpdate(userId, userData, { new: true });
        if (!updatedUser) {
            return resp.status(404).json({ message: 'User not found' });
        }
        resp.json(updatedUser);
    }
    catch (error) {
        console.error('Error updating user profile:', error);
        resp.status(500).json({ message: 'Internal server error' });
    }
}));
// Create Wallet account
exports.app.post('/api/v1/wallet', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
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
        let payload;
        try {
            // Verify the token
            payload = jsonwebtoken_1.default.verify(token, `${process.env.SECRET_KEY}`);
        }
        catch (error) {
            return resp.status(401).send("Unauthorized");
        }
        // Check if payload is valid
        if (!payload || typeof payload === 'string') {
            return resp.status(401).send("Unauthorized");
        }
        // Extract userId from payload
        const userId = payload.subject;
        // Check if the user already has a wallet
        const existingWallet = yield schema_1.Wallet.findOne({ userId: userId });
        if (existingWallet) {
            return resp.status(400).json({ error: 'User already has a wallet' });
        }
        // Create a new wallet for the user
        // check if name is empty when creating a new wallet
        if (!name) {
            return resp.status(400).json({ error: 'Name of the wallet cannot be empty' });
        }
        const newWallet = new schema_1.Wallet({
            userId: userId,
            name: name,
            balance: 0,
            walletAccountNumber: (0, utils_1.accountNumberGenerator)().toString(),
            expiresAt: (0, utils_1.getWalletExpiryDate)()
        });
        yield newWallet.save();
        resp.status(201).json({ message: 'Wallet created successfully', wallet: newWallet });
    }
    catch (error) {
        console.error('Error creating wallet:', error);
        resp.status(500).json({ error: 'An unexpected error occurred' });
    }
}));
exports.app.post('/api/v1/wallet/credit', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
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
        let payload;
        try {
            // Verify the token
            payload = jsonwebtoken_1.default.verify(token, `${process.env.SECRET_KEY}`);
        }
        catch (error) {
            return resp.status(401).send("Unauthorized");
        }
        // Check if payload is valid
        if (!payload || typeof payload === 'string') {
            return resp.status(401).send("Unauthorized");
        }
        // Extract userId from payload
        const userId = payload.subject;
        // Check if the user has a wallet
        const wallet = yield schema_1.Wallet.findOne({ userId: userId });
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
        yield wallet.save();
        //Also save the transaction for tracking purposes
        const transaction = {
            senderId: userId,
            amount: amount,
            type: 'credit'
        };
        yield schema_1.Transaction.create(transaction);
        resp.status(200).json({ message: 'Wallet credited successfully', wallet });
    }
    catch (error) {
        console.error('Error crediting wallet:', error);
        resp.status(500).json({ error: 'An unexpected error occurred' });
    }
}));
exports.app.get('/api/v1/wallet/balance', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
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
        let payload;
        try {
            // Verify the token
            payload = jsonwebtoken_1.default.verify(token, `${process.env.SECRET_KEY}`);
        }
        catch (error) {
            return resp.status(401).send("Unauthorized");
        }
        // Check if payload is valid
        if (!payload || typeof payload === 'string') {
            return resp.status(401).send("Unauthorized");
        }
        const userId = payload.subject;
        // Check if the user has a wallet
        const { walletAccountNumber } = req.body;
        const wallet = yield schema_1.Wallet.findOne({ walletAccountNumber: walletAccountNumber });
        if (!wallet) {
            return resp.status(404).json({ error: 'Wallet not found' });
        }
        resp.status(200).json({ message: 'Success', wallet });
    }
    catch (error) {
        console.error('Error fetching wallet balance :', error);
        resp.status(500).json({ error: 'An unexpected error occurred' });
    }
}));
exports.app.post('/api/v1/wallet/debit', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
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
        let payload;
        try {
            // Verify the token
            payload = jsonwebtoken_1.default.verify(token, `${process.env.SECRET_KEY}`);
        }
        catch (error) {
            return resp.status(401).send("Unauthorized");
        }
        // Check if payload is valid
        if (!payload || typeof payload === 'string') {
            return resp.status(401).send("Unauthorized");
        }
        // Extract userId from payload
        const userId = payload.subject;
        // Check if the user has a wallet
        const wallet = yield schema_1.Wallet.findOne({ userId: userId });
        if (!wallet) {
            return resp.status(404).json({ error: 'Wallet not found' });
        }
        // Extract the amount to credit from the request body
        const { amount, walletAccountNumber } = req.body;
        const receiver = yield schema_1.Wallet.findOne({ walletAccountNumber: walletAccountNumber });
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
        yield receiver.save();
        //Also save the transaction for tracking purposes
        const tr = {
            senderId: userId,
            amount: amount,
            type: 'credit'
        };
        yield schema_1.Transaction.create(tr);
        // Update wallet balance
        wallet.balance -= amount;
        yield wallet.save();
        // Credit  the receiver Wallet Account
        //Also save the transaction for tracking purposes
        const transaction = {
            senderId: userId,
            receiverWalletAccountNumber: receiver.walletAccountNumber,
            amount: amount,
            type: 'debit'
        };
        yield schema_1.Transaction.create(transaction);
        resp.status(200).json({ message: 'Wallet debited successfully', wallet });
    }
    catch (error) {
        console.error('Error crediting wallet:', error);
        resp.status(500).json({ error: 'An unexpected error occurred' });
    }
}));
// Define route for sending funds
exports.app.post('/api/v1/transaction/send', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
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
        let payload;
        try {
            // Verify the token
            payload = jsonwebtoken_1.default.verify(token, `${process.env.SECRET_KEY}`);
        }
        catch (error) {
            return resp.status(401).send("Unauthorized");
        }
        // Check if payload is valid
        if (!payload || typeof payload === 'string') {
            return resp.status(401).send("Unauthorized");
        }
        // Extract userId from payload
        const userId = payload.subject;
        // Check if the user has a wallet
        const wallet = yield schema_1.Wallet.findOne({ userId: userId });
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
        const receiver = yield schema_1.Wallet.findOne({ walletAccountNumber: receiverAccountNumber });
        if (!receiver) {
            return resp.status(404).json({ error: 'Receiver\'s Wallet not found' });
        }
        // Credit the receiver's account
        receiver.balance += amount;
        yield receiver.save();
        // debit the  sender's account
        wallet.balance -= amount;
        yield wallet.save();
        // Create transaction record
        const transaction = new schema_1.Transaction({
            senderId: wallet.userId,
            receiverId: receiver.userId,
            amount: amount,
            walletAccountNumber: wallet.walletAccountNumber,
            name: wallet.name,
            type: 'debit',
        });
        yield transaction.save();
        const tr = new schema_1.Transaction({
            senderId: receiver.userId,
            receiverId: wallet.userId,
            amount: amount,
            walletAccountNumber: receiver.walletAccountNumber,
            name: receiver.name,
            type: 'credit',
        });
        yield tr.save();
        //Trigger Notification here
        resp.json({ message: 'Funds sent successfully' });
    }
    catch (error) {
        console.error('Error sending funds:', error);
        resp.status(500).json({ message: 'Internal server error' });
    }
}));
// Define route for withdrawing funds from user's wallet
exports.app.post('/api/v1/user/:userId/wallet/withdraw', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
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
        let payload;
        try {
            // Verify the token
            payload = jsonwebtoken_1.default.verify(token, `${process.env.SECRET_KEY}`);
        }
        catch (error) {
            return resp.status(401).send("Unauthorized");
        }
        // Check if payload is valid
        if (!payload || typeof payload === 'string') {
            return resp.status(401).send("Unauthorized");
        }
        // Extract userId from payload
        const userId = payload.subject;
        console.log("USERID", userId);
        console.log("USER", req.params.userId);
        if (userId !== req.params.userId) {
            return resp.status(404).json({ message: 'You can only withdraw from your own account' });
        }
        // Find the user's wallet
        const wallet = yield schema_1.Wallet.findOne({ userId });
        if (!wallet) {
            return resp.status(404).json({ message: 'Wallet not found' });
        }
        // Check if there are sufficient funds
        if (wallet.balance < amount) {
            return resp.status(400).json({ message: 'Insufficient funds' });
        }
        // Update the wallet balance after withdrawal
        wallet.balance -= amount;
        yield wallet.save();
        resp.json({ message: 'Withdrawal successful', newBalance: wallet.balance });
    }
    catch (error) {
        console.error('Error withdrawing funds:', error);
        resp.status(500).json({ message: 'Internal server error' });
    }
}));
// Define route for getting transaction history for user's wallet
exports.app.get('/api/v1/user/:userId/wallet/transactions', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
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
        let payload;
        try {
            // Verify the token
            payload = jsonwebtoken_1.default.verify(token, `${process.env.SECRET_KEY}`);
        }
        catch (error) {
            return resp.status(401).send("Unauthorized");
        }
        // Check if payload is valid
        if (!payload || typeof payload === 'string') {
            return resp.status(401).send("Unauthorized");
        }
        // Extract userId from payload
        const userId = payload.subject;
        // Find transactions where the user is either sender or receiver
        const transactions = yield schema_1.Transaction.find({
            $or: [{ senderId: userId }, { receiverId: userId }],
        }).sort({ timestamp: -1 }); // Sort by timestamp in descending order
        resp.json(transactions);
    }
    catch (error) {
        console.error('Error fetching wallet transactions:', error);
        resp.status(500).json({ message: 'Internal server error' });
    }
}));
// Define the route
exports.app.get('/api/v1/ransaction/wallet/:walletId', (req, resp) => __awaiter(void 0, void 0, void 0, function* () {
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
        let payload;
        try {
            // Verify the token
            payload = jsonwebtoken_1.default.verify(token, `${process.env.SECRET_KEY}`);
        }
        catch (error) {
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
        const transactions = yield schema_1.Transaction.find({});
        // Send the list of transactions as the HTTP response
        resp.status(200).json({ transactions });
    }
    catch (error) {
        console.error('Error fetching transactions:', error);
        resp.status(500).json({ error: 'Internal server error' });
    }
}));
// Server start
const PORT = process.env.PORT || 3000;
function runServer() {
    try {
        (0, mongoConnector_1.dbConection)();
        exports.app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (e) {
        console.error(e);
    }
}
runServer();
