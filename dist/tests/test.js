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
const chai_1 = require("chai");
const chai_http_1 = __importDefault(require("chai-http"));
const mocha_1 = require("mocha");
const bcrypt_1 = __importDefault(require("bcrypt"));
const schema_1 = require("../models/schema");
const app_1 = require("../app");
chai.use(chai_http_1.default); // Use chaiHttp plugin
(0, mocha_1.describe)('User Registration', () => {
    (0, mocha_1.it)('should register a new user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        };
        // Clear existing user data
        yield schema_1.User.deleteMany({});
        // Make POST request to register a new user
        const res = yield chai.request(app_1.app) // Use chai.request for HTTP requests
            .post('/api/user/signup')
            .send(userData);
        // Assert the response status code
        (0, chai_1.expect)(res.status).to.equal(200);
        // Assert the response body
        (0, chai_1.expect)(res.body).to.have.property('message').to.equal('User registered successfully');
        // Verify user is saved in the database
        const user = yield schema_1.User.findOne({ email: userData.email });
        (0, chai_1.expect)(user).to.exist;
        (0, chai_1.expect)(user === null || user === void 0 ? void 0 : user.username).to.equal(userData.username);
        // Verify password is hashed
        const isPasswordCorrect = yield bcrypt_1.default.compare(userData.password, (user === null || user === void 0 ? void 0 : user.password) || '');
        (0, chai_1.expect)(isPasswordCorrect).to.be.true;
    }));
});
