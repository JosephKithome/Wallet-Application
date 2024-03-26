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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
describe('User Registration Endpoint', () => {
    it('should register a new user with valid data', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe',
            phone: '1234567890'
        };
        const res = yield (0, supertest_1.default)(app_1.app)
            .post('/api/v1/user/signup')
            .send(userData);
        expect(res.status).toEqual(200);
        expect(res.body.message).toEqual('User registered successfully');
    }));
    it('should return an error for invalid username', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            username: '', // Empty username
            email: 'test@example.com',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe',
            phone: '1234567890'
        };
        const res = yield (0, supertest_1.default)(app_1.app)
            .post('/api/v1/user/signup')
            .send(userData);
        expect(res.status).toEqual(400);
        expect(res.body.error).toEqual('Please provide a valid username');
    }));
});
describe('User Login Endpoint', () => {
    it('should successfully log in a user with valid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            email: 'test@example.com',
            password: 'password123'
        };
        const res = yield (0, supertest_1.default)(app_1.app)
            .post('/api/v1/user/login')
            .send(userData);
        expect(res.status).toEqual(200);
        expect(res.body.token).toBeDefined();
    }));
    it('should return an error for invalid email', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            email: '', // Empty email
            password: 'password123'
        };
        const res = yield (0, supertest_1.default)(app_1.app)
            .post('/api/v1/user/login')
            .send(userData);
        expect(res.status).toEqual(400);
        expect(res.body.error).toEqual('Please provide a valid email and password');
    }));
    it('should return an error for invalid password', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            email: 'test@example.com',
            password: '' // Empty password
        };
        const res = yield (0, supertest_1.default)(app_1.app)
            .post('/api/v1/user/login')
            .send(userData);
        expect(res.status).toEqual(400);
        expect(res.body.error).toEqual('Please provide a valid password');
    }));
    it('should return an error for user not found', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            email: 'nonexistent@example.com',
            password: 'password123'
        };
        const res = yield (0, supertest_1.default)(app_1.app)
            .post('/api/v1/user/login')
            .send(userData);
        expect(res.status).toEqual(401);
        expect(res.text).toEqual('Invalid Email');
    }));
    // Test case for incorrect password
    it('should return an error for incorrect password', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            email: 'test@example.com',
            password: 'incorrectpassword'
        };
        const res = yield (0, supertest_1.default)(app_1.app)
            .post('/api/v1/user/login')
            .send(userData);
        expect(res.status).toEqual(401);
        expect(res.text).toEqual('Invalid email');
    }));
});
