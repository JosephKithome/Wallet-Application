import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import expressHttpProxy from 'express-http-proxy';
import morgan from 'morgan'; // Import morgan

export const app: Application = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Use morgan for logging
// Define a custom token to capture the log message
morgan.token('logMessage', (req: Request, res: Response) => res.locals.logMessage);

// Use morgan middleware with the custom token
app.use(morgan(':logMessage', {
    // Define immediate option to ensure logs are generated for each request
    immediate: true
}));

app.use("/wallet", expressHttpProxy("http://localhost:3001"));
app.use("/auth/", expressHttpProxy("http://localhost:3000"));

// Routes
app.get('/', (req, res) => {
    // Log a message
    console.log("This is a test log message");
    
    // Set the log message in response locals
    res.locals.logMessage = "This is a test log message";
    
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
            <script>
                // JavaScript variable to store log messages
                const logMessages = ${JSON.stringify(res.locals.logMessages || [])};
            </script>
        </head>
        <body>
            <h1>Welcome to the ApiGateway For Our Microservice Application</h1>
            <p>This is a simple Microservice showcassing the skills of building distributed systems.</p>
            <div class="log-messages">
                <h2>Log Messages</h2>
                <ul>
                    ${(res.locals.logMessages || []).map((message: string) => `<li>${message}</li>`).join('')}
                </ul>
            </div>
            <div class="footer">Developed by: Joseph Kithome, Software Engineer at DDS </div>
        </body>
        </html>
    `;
    
    // Send the HTML content as the response
    res.send(htmlContent);
});

// Server start
const PORT = process.env.PORT || 8000;

function runServer() {
    try {
        // mongoConnector.connect();
        app.listen(PORT, () => {
            console.log(`Server started on port http://localhost:${PORT}`)
        });
    } catch (e) {
        console.error(e);
    }
}

runServer();
