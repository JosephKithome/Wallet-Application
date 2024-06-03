import express, { Application } from 'express';
import bodyParser from 'body-parser';

import { MongoConnector } from './database/mongoConnector';
import { WalletControlller } from './controller/WalletController';
import { CustomLogger } from './utils/logger';


const  mongoConnector = new MongoConnector();
const walletController = new WalletControlller();
const  logger = new CustomLogger();


export const app: Application = express();

// Middleware
app.use(bodyParser.json());


app.post('/api/v1/wallet', walletController.createWallet);
app.post('/api/v1/wallet/credit', walletController.creditWallet);
app.post('/api/v1/wallet/debit', walletController.debitWallet);
app.get('/api/v1/wallet/balance', walletController.getWalletBalance);
app.get('/api/v1/wallet', walletController.getWalletbyName);
app.post('/api/v1/user/wallet/withdraw', walletController.withdrawFunds)


// Swagger setup
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.get('/', (req, res) => {
    // HTML content with updated styles
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #000; /* Background color set to black */
                    color: #fff; /* Text color set to white */
                    text-align: center;
                    padding: 20px;
                }
                h1 {
                    color: #ffcc00; /* Header text color set to yellow */
                }
                .footer {
                    font-size: 12px;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <h1>Welcome to the Wallet Microservice Application</h1>
            <p>This is a simple Microservice  showcassing the skills of building distributed systems.</p>
            <div class="footer">Developed by:Joseph Kithome Software Engineer at DDS </div>
        </body>
        </html>
    `;
    
    // Send the HTML content as the response
    res.send(htmlContent);
});

// Server start
const PORT = process.env.PORT || 3001;

function runServer() {
    try {
        mongoConnector.connect();
        app.listen(PORT, () => {
            logger.logInfo(`Server started on port http://localhost:${PORT}`)
        });
    } catch (e) {
        console.error(e);
    }
}

runServer();
