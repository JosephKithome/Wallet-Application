var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import swaggerUi from 'swagger-ui-express';
import { dbConection } from '../database/mongoConnector';
import { Transaction, User, Wallet } from '../models/schema';
import { swaggerDocument } from '../documentation/swagger';
import bcrypt from 'bcrypt';
import { accountNumberGenerator, getWalletExpiryDate } from '../utils/utils';
export var app = express();
// Middleware
app.use(bodyParser.json());
// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Routes
app.get('/', function (req, res) {
    res.send('Hello World!');
});
// Register endpoint
app.post("/api/user/signup", function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var userData, user, existingUser, hashedPassword, registeredUser, payload, token, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                userData = req.body;
                user = new User(userData);
                return [4 /*yield*/, User.findOne({ email: userData.email })];
            case 1:
                existingUser = _a.sent();
                if (existingUser) {
                    return [2 /*return*/, resp.status(400).json({ error: 'User already exists' })];
                }
                return [4 /*yield*/, bcrypt.hash(userData.password, 12)];
            case 2:
                hashedPassword = _a.sent();
                user.password = hashedPassword;
                return [4 /*yield*/, user.save()];
            case 3:
                registeredUser = _a.sent();
                payload = { subject: registeredUser._id };
                token = jwt.sign(payload, 'secretkey');
                if (token !== "") {
                    resp.status(200).json({ message: 'User registered successfully' });
                }
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.error(error_1);
                resp.status(500).send("Error occurred while registering user.");
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Login endpoint
app.post("/api/user/login", function (req, resp) {
    var userData = req.body;
    User.findOne({ email: userData.email })
        .then(function (dbUser) {
        if (!dbUser) {
            resp.status(401).send("Invalid Email");
            return;
        }
        if (dbUser.password !== userData.password) {
            resp.status(401).send("Invalid password");
            return;
        }
        var payload = { subject: dbUser._id };
        var token = jwt.sign(payload, "".concat(process.env.SECRET_KEY));
        resp.status(200).send({ token: token });
    })
        .catch(function (error) {
        console.log(error);
        resp.status(500).send("Internal Server Error");
    });
});
//Get user details by user ID
app.get('/api/user/:userId', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, token, payload, user, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.params.userId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                // Check if the authorization header is missing
                if (!req.headers.authorization) {
                    return [2 /*return*/, resp.status(401).send("Unauthorized request!!")];
                }
                token = req.headers.authorization.split(' ')[1];
                // Check if the token is null
                if (token === "null") {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                payload = void 0;
                try {
                    // Verify the token
                    payload = jwt.verify(token, "".concat(process.env.SECRET_KEY));
                }
                catch (error) {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                // Check if payload is valid
                if (!payload || typeof payload === 'string') {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                return [4 /*yield*/, User.findById(userId)];
            case 2:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, resp.status(404).json({ message: 'User not found' })];
                }
                resp.json(user);
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error('Error fetching user:', error_2);
                resp.status(500).json({ message: 'Internal server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// update user profile
app.put('/api/user/:userId', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, userData, token, payload, updatedUser, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.params.userId;
                userData = req.body;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                // Check if the authorization header is missing
                if (!req.headers.authorization) {
                    return [2 /*return*/, resp.status(401).send("Unauthorized request!!")];
                }
                token = req.headers.authorization.split(' ')[1];
                // Check if the token is null
                if (token === "null") {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                payload = void 0;
                try {
                    // Verify the token
                    payload = jwt.verify(token, "".concat(process.env.SECRET_KEY));
                }
                catch (error) {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                // Check if payload is valid
                if (!payload || typeof payload === 'string') {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                return [4 /*yield*/, User.findByIdAndUpdate(userId, userData, { new: true })];
            case 2:
                updatedUser = _a.sent();
                if (!updatedUser) {
                    return [2 /*return*/, resp.status(404).json({ message: 'User not found' })];
                }
                resp.json(updatedUser);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error('Error updating user profile:', error_3);
                resp.status(500).json({ message: 'Internal server error' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Create Wallet account
app.post('/wallet', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var token, payload, userId, existingWallet, newWallet, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                // Check if the authorization header is missing
                if (!req.headers.authorization) {
                    return [2 /*return*/, resp.status(401).send("Unauthorized request!!")];
                }
                token = req.headers.authorization.split(' ')[1];
                // Check if the token is null
                if (token === "null") {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                payload = void 0;
                try {
                    // Verify the token
                    payload = jwt.verify(token, "".concat(process.env.SECRET_KEY));
                }
                catch (error) {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                // Check if payload is valid
                if (!payload || typeof payload === 'string') {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                userId = payload.subject;
                return [4 /*yield*/, Wallet.findOne({ userId: userId })];
            case 1:
                existingWallet = _a.sent();
                if (existingWallet) {
                    return [2 /*return*/, resp.status(400).json({ error: 'User already has a wallet' })];
                }
                newWallet = new Wallet({
                    userId: userId,
                    balance: 0,
                    walletAccountNumber: accountNumberGenerator().toString(),
                    expiresAt: getWalletExpiryDate()
                });
                return [4 /*yield*/, newWallet.save()];
            case 2:
                _a.sent();
                resp.status(201).json({ message: 'Wallet created successfully', wallet: newWallet });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error('Error creating wallet:', error_4);
                resp.status(500).json({ error: 'An unexpected error occurred' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post('/wallet/credit', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var token, payload, userId, wallet, amount, transaction, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                // Check if the authorization header is missing
                if (!req.headers.authorization) {
                    return [2 /*return*/, resp.status(401).send("Unauthorized request!!")];
                }
                token = req.headers.authorization.split(' ')[1];
                // Check if the token is null
                if (token === "null") {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                payload = void 0;
                try {
                    // Verify the token
                    payload = jwt.verify(token, "".concat(process.env.SECRET_KEY));
                }
                catch (error) {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                // Check if payload is valid
                if (!payload || typeof payload === 'string') {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                userId = payload.subject;
                return [4 /*yield*/, Wallet.findOne({ userId: userId })];
            case 1:
                wallet = _a.sent();
                if (!wallet) {
                    return [2 /*return*/, resp.status(404).json({ error: 'Wallet not found' })];
                }
                amount = req.body.amount;
                // Validate the amount
                if (typeof amount !== 'number' || amount <= 0) {
                    return [2 /*return*/, resp.status(400).json({ error: 'Invalid amount' })];
                }
                // Update wallet balance
                wallet.balance += amount;
                return [4 /*yield*/, wallet.save()];
            case 2:
                _a.sent();
                transaction = {
                    senderId: userId,
                    amount: amount,
                    type: 'credit'
                };
                return [4 /*yield*/, Transaction.create(transaction)];
            case 3:
                _a.sent();
                resp.status(200).json({ message: 'Wallet credited successfully', wallet: wallet });
                return [3 /*break*/, 5];
            case 4:
                error_5 = _a.sent();
                console.error('Error crediting wallet:', error_5);
                resp.status(500).json({ error: 'An unexpected error occurred' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.get('/wallet/balance', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var token, payload, userId, walletAccountNumber, wallet, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                // Check if the authorization header is missing
                if (!req.headers.authorization) {
                    return [2 /*return*/, resp.status(401).send("Unauthorized request!!")];
                }
                token = req.headers.authorization.split(' ')[1];
                // Check if the token is null
                if (token === "null") {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                payload = void 0;
                try {
                    // Verify the token
                    payload = jwt.verify(token, "".concat(process.env.SECRET_KEY));
                }
                catch (error) {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                // Check if payload is valid
                if (!payload || typeof payload === 'string') {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                userId = payload.subject;
                walletAccountNumber = req.body.walletAccountNumber;
                return [4 /*yield*/, Wallet.findOne({ walletAccountNumber: walletAccountNumber })];
            case 1:
                wallet = _a.sent();
                if (!wallet) {
                    return [2 /*return*/, resp.status(404).json({ error: 'Wallet not found' })];
                }
                resp.status(200).json({ message: 'Success', wallet: wallet });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error('Error fetching wallet balance :', error_6);
                resp.status(500).json({ error: 'An unexpected error occurred' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/wallet/debit', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var token, payload, userId, wallet, _a, amount, walletAccountNumber, receiver, tr, transaction, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                // Check if the authorization header is missing
                if (!req.headers.authorization) {
                    return [2 /*return*/, resp.status(401).send("Unauthorized request!!")];
                }
                token = req.headers.authorization.split(' ')[1];
                // Check if the token is null
                if (token === "null") {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                payload = void 0;
                try {
                    // Verify the token
                    payload = jwt.verify(token, "".concat(process.env.SECRET_KEY));
                }
                catch (error) {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                // Check if payload is valid
                if (!payload || typeof payload === 'string') {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                userId = payload.subject;
                return [4 /*yield*/, Wallet.findOne({ userId: userId })];
            case 1:
                wallet = _b.sent();
                if (!wallet) {
                    return [2 /*return*/, resp.status(404).json({ error: 'Wallet not found' })];
                }
                _a = req.body, amount = _a.amount, walletAccountNumber = _a.walletAccountNumber;
                return [4 /*yield*/, Wallet.findOne({ walletAccountNumber: walletAccountNumber })];
            case 2:
                receiver = _b.sent();
                if (!receiver) {
                    return [2 /*return*/, resp.status(404).json({ error: 'Wallet not found' })];
                }
                // Validate the amount
                if (typeof amount !== 'number' || amount <= 0) {
                    return [2 /*return*/, resp.status(400).json({ error: 'Invalid amount' })];
                }
                // validate if the sending amount is more than the amount in the amount account
                if (amount > wallet.balance) {
                    return [2 /*return*/, resp.status(400).json({ error: 'Insufficient funds' })];
                }
                receiver.balance += amount;
                return [4 /*yield*/, receiver.save()];
            case 3:
                _b.sent();
                tr = {
                    senderId: userId,
                    amount: amount,
                    type: 'credit'
                };
                return [4 /*yield*/, Transaction.create(tr)];
            case 4:
                _b.sent();
                // Update wallet balance
                wallet.balance -= amount;
                return [4 /*yield*/, wallet.save()];
            case 5:
                _b.sent();
                transaction = {
                    senderId: userId,
                    receiverWalletAccountNumber: receiver.walletAccountNumber,
                    amount: amount,
                    type: 'debit'
                };
                return [4 /*yield*/, Transaction.create(transaction)];
            case 6:
                _b.sent();
                resp.status(200).json({ message: 'Wallet debited successfully', wallet: wallet });
                return [3 /*break*/, 8];
            case 7:
                error_7 = _b.sent();
                console.error('Error crediting wallet:', error_7);
                resp.status(500).json({ error: 'An unexpected error occurred' });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
// Define route for sending funds
app.post('/api/transaction/send', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, amount, receiverAccountNumber, token, payload, userId, wallet, receiver, transaction, tr, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, amount = _a.amount, receiverAccountNumber = _a.receiverAccountNumber;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 8, , 9]);
                // Check if the authorization header is missing
                if (!req.headers.authorization) {
                    return [2 /*return*/, resp.status(401).send("Unauthorized request!!")];
                }
                token = req.headers.authorization.split(' ')[1];
                // Check if the token is null
                if (token === "null") {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                payload = void 0;
                try {
                    // Verify the token
                    payload = jwt.verify(token, "".concat(process.env.SECRET_KEY));
                }
                catch (error) {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                // Check if payload is valid
                if (!payload || typeof payload === 'string') {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                userId = payload.subject;
                return [4 /*yield*/, Wallet.findOne({ userId: userId })];
            case 2:
                wallet = _b.sent();
                if (!wallet) {
                    return [2 /*return*/, resp.status(404).json({ error: 'Wallet for user not found' })];
                }
                // Validate the amount
                if (typeof amount !== 'number' || amount <= 0) {
                    return [2 /*return*/, resp.status(400).json({ error: 'Invalid amount' })];
                }
                // validate if the sending amount is more than the amount in the amount account
                if (amount > wallet.balance) {
                    return [2 /*return*/, resp.status(400).json({ error: 'Insufficient funds' })];
                }
                return [4 /*yield*/, Wallet.findOne({ walletAccountNumber: receiverAccountNumber })];
            case 3:
                receiver = _b.sent();
                if (!receiver) {
                    return [2 /*return*/, resp.status(404).json({ error: 'Receiver\'s Wallet not found' })];
                }
                // Credit the receiver's account
                receiver.balance += amount;
                return [4 /*yield*/, receiver.save()];
            case 4:
                _b.sent();
                // debit the  sender's account
                wallet.balance -= amount;
                return [4 /*yield*/, wallet.save()];
            case 5:
                _b.sent();
                transaction = new Transaction({
                    senderId: wallet.userId,
                    receiverId: receiver.userId,
                    amount: amount,
                    walletAccountNumber: wallet.walletAccountNumber,
                    type: 'debit',
                });
                return [4 /*yield*/, transaction.save()];
            case 6:
                _b.sent();
                tr = new Transaction({
                    senderId: receiver.userId,
                    receiverId: wallet.userId,
                    amount: amount,
                    walletAccountNumber: receiver.walletAccountNumber,
                    type: 'credit',
                });
                return [4 /*yield*/, tr.save()];
            case 7:
                _b.sent();
                //Trigger Notification here
                resp.json({ message: 'Funds sent successfully' });
                return [3 /*break*/, 9];
            case 8:
                error_8 = _b.sent();
                console.error('Error sending funds:', error_8);
                resp.status(500).json({ message: 'Internal server error' });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
// Define route for withdrawing funds from user's wallet
app.post('/api/users/:userId/wallet/withdraw', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var amount, token, payload, userId, wallet, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                amount = req.body.amount;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                // Check if the authorization header is missing
                if (!req.headers.authorization) {
                    return [2 /*return*/, resp.status(401).send("Unauthorized request!!")];
                }
                token = req.headers.authorization.split(' ')[1];
                // Check if the token is null
                if (token === "null") {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                payload = void 0;
                try {
                    // Verify the token
                    payload = jwt.verify(token, "".concat(process.env.SECRET_KEY));
                }
                catch (error) {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                // Check if payload is valid
                if (!payload || typeof payload === 'string') {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                userId = payload.subject;
                if (userId !== req.params.userId) {
                    return [2 /*return*/, resp.status(404).json({ message: 'You can only withdraw from your own account' })];
                }
                return [4 /*yield*/, Wallet.findOne({ userId: userId })];
            case 2:
                wallet = _a.sent();
                if (!wallet) {
                    return [2 /*return*/, resp.status(404).json({ message: 'Wallet not found' })];
                }
                // Check if there are sufficient funds
                if (wallet.balance < amount) {
                    return [2 /*return*/, resp.status(400).json({ message: 'Insufficient funds' })];
                }
                // Update the wallet balance after withdrawal
                wallet.balance -= amount;
                return [4 /*yield*/, wallet.save()];
            case 3:
                _a.sent();
                resp.json({ message: 'Withdrawal successful', newBalance: wallet.balance });
                return [3 /*break*/, 5];
            case 4:
                error_9 = _a.sent();
                console.error('Error withdrawing funds:', error_9);
                resp.status(500).json({ message: 'Internal server error' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Define route for getting transaction history for user's wallet
app.get('/api/users/:userId/wallet/transactions', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var token, payload, userId, transactions, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                // Check if the authorization header is missing
                if (!req.headers.authorization) {
                    return [2 /*return*/, resp.status(401).send("Unauthorized request!!")];
                }
                token = req.headers.authorization.split(' ')[1];
                // Check if the token is null
                if (token === "null") {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                payload = void 0;
                try {
                    // Verify the token
                    payload = jwt.verify(token, "".concat(process.env.SECRET_KEY));
                }
                catch (error) {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                // Check if payload is valid
                if (!payload || typeof payload === 'string') {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                userId = payload.subject;
                return [4 /*yield*/, Transaction.find({
                        $or: [{ senderId: userId }, { receiverId: userId }],
                    }).sort({ timestamp: -1 })];
            case 1:
                transactions = _a.sent();
                resp.json(transactions);
                return [3 /*break*/, 3];
            case 2:
                error_10 = _a.sent();
                console.error('Error fetching wallet transactions:', error_10);
                resp.status(500).json({ message: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Define the route
app.get('/api/transaction/wallet/:walletId', function (req, resp) { return __awaiter(void 0, void 0, void 0, function () {
    var token, payload, userId, walletId, transactions, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                // Check if the authorization header is missing
                if (!req.headers.authorization) {
                    return [2 /*return*/, resp.status(401).send("Unauthorized request!!")];
                }
                token = req.headers.authorization.split(' ')[1];
                // Check if the token is null
                if (token === "null") {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                payload = void 0;
                try {
                    // Verify the token
                    payload = jwt.verify(token, "".concat(process.env.SECRET_KEY));
                }
                catch (error) {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                // Check if payload is valid
                if (!payload || typeof payload === 'string') {
                    return [2 /*return*/, resp.status(401).send("Unauthorized")];
                }
                userId = payload.subject;
                walletId = req.params.walletId;
                return [4 /*yield*/, Transaction.find({})];
            case 1:
                transactions = _a.sent();
                // Send the list of transactions as the HTTP response
                resp.status(200).json({ transactions: transactions });
                return [3 /*break*/, 3];
            case 2:
                error_11 = _a.sent();
                console.error('Error fetching transactions:', error_11);
                resp.status(500).json({ error: 'Internal server error' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Server start
var PORT = 4000;
function runServer() {
    try {
        dbConection();
        app.listen(PORT, function () {
            console.log("Server is running on port ".concat(PORT));
        });
    }
    catch (e) {
        console.error(e);
    }
}
runServer();
