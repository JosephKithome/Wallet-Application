export var swaggerDocument = {
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
    },
};
