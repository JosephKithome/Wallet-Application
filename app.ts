

import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './documentation/swagger';
import { MongoConnector } from './database/mongoConnector';
import { AuthController } from './controllers/auth/AuthController';
import { UserController } from './controllers/user/UserController';
import { WalletControlller } from './controllers/wallet/WalletController';
import { TransactionController } from './controllers/transactions/TransactionsController';
import { CurrencyController } from './controllers/currency/CurrencyController';
import { BankController } from './controllers/bank/BankController';
import { CustomLogger } from './utils/logger';


export const app: Application = express();

// Middleware
app.use(bodyParser.json());

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Wallet Application');
});

const  mongoConnector = new MongoConnector();
const authController = new AuthController();
const userController = new UserController();
const walletController = new WalletControlller();
const transactionController = new TransactionController();
const currencyController = new CurrencyController();
const bankController = new BankController();
const  logger = new CustomLogger();


app.post("/api/v1/user/signup", authController.signUp);
app.post("/api/v1/user/login", authController.login);
app.post("/api/v1/user/reset-password", authController.resetPassword);
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
        mongoConnector.connect();
        app.listen(PORT, () => {
            logger.logInfo(`Server started on port ${PORT}`)
        });
    } catch (e) {
        console.error(e);
    }
}

runServer();
