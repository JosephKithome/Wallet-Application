import { sendSMSNotification } from './integrations/sms';
import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import jwt, { JwtPayload } from 'jsonwebtoken';
import swaggerUi from 'swagger-ui-express';
import { dbConection } from './database/mongoConnector';
import {
    BankAccount,
    Currency,
    Notification,
    Transaction,
    User,
    Wallet
} from './models/schema';
import { swaggerDocument } from './documentation/swagger';
import bcrypt from 'bcrypt';
import {
    accountNumberGenerator,
    generateRandomCVV,
    getWalletExpiryDate
} from './utils/utils';

import { AuthController } from './controllers/auth/AuthController';
import { UserController } from './controllers/user/UserController';
import { WalletControlller } from './controllers/wallet/WalletController';
import { TransactionController } from './controllers/transactions/TransactionsController';
import { CurrencyController } from './controllers/currency/CurrencyController';
import { BankController } from './controllers/bank/BankController';

export const app: Application = express();

// Middleware
app.use(bodyParser.json());

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Wallet Application');
});

const authController = new AuthController();
const userController = new UserController();
const walletController = new WalletControlller();
const transactionController = new TransactionController();
const currencyController = new CurrencyController();
const bankController = new BankController();


app.post("/api/v1/user/signup", authController.signUp);
app.post("/api/v1/user/login", authController.login);
app.get('/api/v1/user/:userId', userController.getUserById);
app.put('/api/v1/user/:userId', userController.updateUserProfile);
app.post('/api/v1/wallet', walletController.createWallet);
app.post('/api/v1/wallet/credit', walletController.creditWallet);
app.post('/api/v1/wallet/debit', walletController.debitWallet);
app.get('/api/v1/wallet/balance', walletController.getWalletBalance);
app.get('/api/v1/wallet', walletController.getWalletbyName);
app.post('/api/v1/send', transactionController.sendFunds);
app.post('/api/v1/user/wallet/withdraw', walletController.withdrawFunds)
app.get('/api/v1/transaction/wallet/:walletId', transactionController.getTransactionsByWalletId);
app.get('/api/v1/user/:userId/wallet/transaction', transactionController.getWalletTransactions);

app.post('/api/v1/currency', currencyController.createCurrency);
app.get('/api/v1/currency', currencyController.getCurrencies);

app.post('/api/v1/bank/account', bankController.createBankAccount);

// Server start
const PORT = process.env.PORT || 3000;

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
