"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const request = require('supertest');
const { app } = require('../app');
// Describe block for the test suite
describe('POST /api/v1/user/login', () => {
    // Test case for valid login
    it('should login user with valid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            email: 'example@example.com',
            password: 'password123' // Assuming this is a valid password
        };
        // Send a POST request to the login endpoint with valid credentials
        const response = yield request(app)
            .post('/api/v1/user/login')
            .send(userData);
        // Expect status code 200
        expect(response.status).toBe(200);
        // Expect response body to have a token
        expect(response.body.token).toBeDefined();
    }));
    // Test case for invalid email
    it('should return 401 for invalid email', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            email: 'invalid@example.com', // Assuming this email does not exist in the database
            password: 'password123'
        };
        // Send a POST request to the login endpoint with invalid email
        const response = yield request(app)
            .post('/api/v1/user/login')
            .send(userData);
        // Expect status code 401
        expect(response.status).toBe(401);
        // Expect response body to contain "Invalid Email"
        expect(response.text).toBe('Invalid Email');
    }));
    // Test case for invalid password
    it('should return 401 for invalid password', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            email: 'example@example.com',
            password: 'invalidpassword' // 
        };
        // Send a POST request to the login endpoint with invalid password
        const response = yield request(app)
            .post('/api/v1/user/login')
            .send(userData);
        // Expect status code 401
        expect(response.status).toBe(401);
        // Expect response body to contain "Invalid password"
        expect(response.text).toBe('Invalid password');
    }));
    // Test case for internal server error
    it('should return 500 for internal server error', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            email: 'example@example.com',
            password: 'password123'
        };
        // Mocking the User.findOne to throw an error
        jest.mock('./path_to_your_user_model_file', () => ({
            User: {
                findOne: jest.fn(() => {
                    throw new Error('Internal Server Error');
                })
            }
        }));
        // Send a POST request to the login endpoint
        const response = yield request(app)
            .post('/api/v1/user/login')
            .send(userData);
        // Expect status code 500
        expect(response.status).toBe(500);
        // Expect response body to contain "Internal Server Error"
        expect(response.text).toBe('Internal Server Error');
    }));
});
