# Wallet Management System Documentation

    This document provides an overview of the Wallet Management System, including its architecture, endpoints, and usage guidelines. The system is designed to facilitate user registration, authentication, wallet         creation, fund transactions, and management of user wallets.

# Architecture Overview
    The Wallet Management System is built using Node.js and Express.js framework. It utilizes MongoDB as the database for storing user information, wallets, and transaction records. JSON Web Tokens (JWT) are employed for     user authentication and authorization purposes.


# Key components of the system include:

Express.js: A web application framework for Node.js used to create server-side applications.
MongoDB: A NoSQL database used for data storage and retrieval.
JWT: JSON Web Tokens used for secure authentication and authorization.
Swagger: Swagger UI is integrated for API documentation and testing purposes.
Prerequisites
Before using the Wallet Management System, ensure the following prerequisites are met:

Node.js and npm are installed on the system.
MongoDB server is running locally or accessible.
Environment variables are properly configured, including the SECRET_KEY for JWT.
Getting Started
To start using the Wallet Management System, follow these steps:

Clone the repository from the provided source.
Install dependencies using npm install.
Configure environment variables, including the MongoDB connection string and SECRET_KEY.
Run the server using nodemon app.ts
