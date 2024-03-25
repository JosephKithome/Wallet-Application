"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerDocument = void 0;
exports.swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Wallet API Documentation',
        version: '1.0.0',
        description: 'API documentation for your application.',
    },
    paths: {
        '/api/auth/register': {
            post: {
                summary: 'Register a new user',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    firstName: { type: 'string' },
                                    lastName: { type: 'string' },
                                    username: { type: 'string' },
                                    email: { type: 'string' },
                                    dob: { type: 'string', format: 'date' },
                                    password: { type: 'string' },
                                },
                                required: ['firstName', 'lastName', 'username', 'email', 'dob', 'password'],
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'User successfully registered',
                    },
                    '500': {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/api/auth/login': {
            post: {
                summary: 'Login to Wallet Application',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string' },
                                    password: { type: 'string' },
                                },
                                required: ['email', 'password'],
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'User successfully logged in.',
                    },
                    '500': {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/api/v1/wallet': {
            post: {
                summary: 'Create a Wallet',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    userId: { type: 'string' },
                                    name: { type: 'string' },
                                    balance: { type: 'number' },
                                },
                                required: ['userId'],
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'Wallet created successfully',
                    },
                    '400': {
                        description: 'User already has a wallet',
                    },
                    '401': {
                        description: 'Unauthorized request',
                    },
                    '500': {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/api/user/:userId': {
            get: {
                summary: 'Get User Details by ID',
                parameters: [
                    {
                        name: 'userId',
                        in: 'path',
                        required: true,
                        description: 'ID of the user',
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'User details retrieved successfully',
                    },
                    '404': {
                        description: 'User not found',
                    },
                    '500': {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/wallet/credit': {
            post: {
                summary: 'Credit Wallet',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    amount: { type: 'number' },
                                },
                                required: ['amount'],
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Wallet credited successfully',
                    },
                    '400': {
                        description: 'Invalid amount',
                    },
                    '401': {
                        description: 'Unauthorized request',
                    },
                    '500': {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/api/transaction/send': {
            post: {
                summary: 'Send Funds',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    amount: { type: 'number' },
                                    receiverAccountNumber: { type: 'string' },
                                },
                                required: ['amount', 'receiverAccountNumber'],
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Funds sent successfully',
                    },
                    '400': {
                        description: 'Invalid amount or Insufficient funds',
                    },
                    '401': {
                        description: 'Unauthorized request',
                    },
                    '404': {
                        description: 'Wallet not found for sender or receiver',
                    },
                    '500': {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/api/users/{userId}/wallet/withdraw': {
            post: {
                summary: 'Withdraw Funds from User\'s Wallet',
                parameters: [
                    {
                        name: 'userId',
                        in: 'path',
                        required: true,
                        description: 'ID of the user',
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    amount: { type: 'number' },
                                },
                                required: ['amount'],
                            },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'Withdrawal successful',
                    },
                    '400': {
                        description: 'Insufficient funds or Invalid amount',
                    },
                    '401': {
                        description: 'Unauthorized request',
                    },
                    '404': {
                        description: 'User\'s wallet not found',
                    },
                    '500': {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/api/users/{userId}/wallet/transactions': {
            get: {
                summary: 'Get Transaction History for User\'s Wallet',
                parameters: [
                    {
                        name: 'userId',
                        in: 'path',
                        required: true,
                        description: 'ID of the user',
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Transaction history retrieved successfully',
                    },
                    '401': {
                        description: 'Unauthorized request',
                    },
                    '404': {
                        description: 'User\'s wallet not found',
                    },
                    '500': {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
        '/api/transaction/wallet/{walletId}': {
            get: {
                summary: 'Get Transaction History for a Wallet',
                parameters: [
                    {
                        name: 'walletId',
                        in: 'path',
                        required: true,
                        description: 'ID of the wallet',
                        schema: {
                            type: 'string',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'Transaction history retrieved successfully',
                    },
                    '401': {
                        description: 'Unauthorized request',
                    },
                    '404': {
                        description: 'Wallet not found',
                    },
                    '500': {
                        description: 'Internal Server Error',
                    },
                },
            },
        },
    },
};
