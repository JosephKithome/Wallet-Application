"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const mongoConnector_1 = require("./database/mongoConnector");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./documentation/swagger");
const AuthController_1 = require("./controllers/auth/AuthController");
const UserController_1 = require("./controllers/user/UserController");
const WalletController_1 = require("./controllers/wallet/WalletController");
const TransactionsController_1 = require("./controllers/transactions/TransactionsController");
const CurrencyController_1 = require("./controllers/currency/CurrencyController");
const BankController_1 = require("./controllers/bank/BankController");
exports.app = (0, express_1.default)();
// Middleware
exports.app.use(body_parser_1.default.json());
// Swagger setup
exports.app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerDocument));
// Routes
exports.app.get('/', (req, res) => {
    res.send('Welcome to Wallet Application');
});
const mongoConnector = new mongoConnector_1.MongoConnector();
const authController = new AuthController_1.AuthController();
const userController = new UserController_1.UserController();
const walletController = new WalletController_1.WalletControlller();
const transactionController = new TransactionsController_1.TransactionController();
const currencyController = new CurrencyController_1.CurrencyController();
const bankController = new BankController_1.BankController();
exports.app.post("/api/v1/user/signup", authController.signUp);
exports.app.post("/api/v1/user/login", authController.login);
exports.app.get('/api/v1/user/:userId', userController.getUserById);
exports.app.put('/api/v1/user/:userId', userController.updateUserProfile);
exports.app.post('/api/v1/wallet', walletController.createWallet);
exports.app.post('/api/v1/wallet/credit', walletController.creditWallet);
exports.app.post('/api/v1/wallet/debit', walletController.debitWallet);
exports.app.get('/api/v1/wallet/balance', walletController.getWalletBalance);
exports.app.get('/api/v1/wallet', walletController.getWalletbyName);
exports.app.post('/api/v1/send', transactionController.sendFunds);
exports.app.post('/api/v1/user/wallet/withdraw', walletController.withdrawFunds);
exports.app.get('/api/v1/transaction/wallet/:walletId', transactionController.getTransactionsByWalletId);
exports.app.get('/api/v1/user/:userId/wallet/transaction', transactionController.getWalletTransactions);
exports.app.post('/api/v1/currency', currencyController.createCurrency);
exports.app.get('/api/v1/currency', currencyController.getCurrencies);
exports.app.post('/api/v1/bank/account', bankController.createBankAccount);
// Server start
const PORT = process.env.PORT || 3000;
function runServer() {
    try {
        mongoConnector.connect();
        exports.app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (e) {
        console.error(e);
    }
}
runServer();
