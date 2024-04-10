import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { AuthController } from './controllers/auth/AuthController';
import { CustomLogger } from './utils/logger';
import { MongoConnector } from './database/mongoConnector';



export const app: Application = express();

// Middleware
app.use(bodyParser.json());

const  mongoConnector = new MongoConnector();
const authController = new AuthController();
const  logger = new CustomLogger();


app.post("/api/v1/user/signup", authController.signUp);
app.post("/api/v1/user/login", authController.login);


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
            <h1>Welcome to the User  Microservice Application</h1>
            <p>This is a simple Microservice  showcassing the skills of building distributed systems.</p>
            <div class="footer">Developed by:Joseph Kithome Software Engineer at DDS </div>
        </body>
        </html>
    `;
    
    // Send the HTML content as the response
    res.send(htmlContent);
});

// Server start
const PORT = process.env.PORT || 3000;

function runServer() {
    try {
        mongoConnector.connect();
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`)
        });
    } catch (e) {
        console.error(e);
    }
}

runServer();
