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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var chai_http_1 = __importDefault(require("chai-http"));
var mocha_1 = require("mocha");
var bcrypt_1 = __importDefault(require("bcrypt"));
var schema_1 = require("../models/schema");
var app_1 = require("../app");
chai.use(chai_http_1.default); // Use chaiHttp plugin
(0, mocha_1.describe)('User Registration', function () {
    (0, mocha_1.it)('should register a new user successfully', function () { return __awaiter(void 0, void 0, void 0, function () {
        var userData, res, user, isPasswordCorrect;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userData = {
                        username: 'testuser',
                        email: 'test@example.com',
                        password: 'password123'
                    };
                    // Clear existing user data
                    return [4 /*yield*/, schema_1.User.deleteMany({})];
                case 1:
                    // Clear existing user data
                    _a.sent();
                    return [4 /*yield*/, chai.request(app_1.app) // Use chai.request for HTTP requests
                            .post('/api/user/signup')
                            .send(userData)];
                case 2:
                    res = _a.sent();
                    // Assert the response status code
                    (0, chai_1.expect)(res.status).to.equal(200);
                    // Assert the response body
                    (0, chai_1.expect)(res.body).to.have.property('message').to.equal('User registered successfully');
                    return [4 /*yield*/, schema_1.User.findOne({ email: userData.email })];
                case 3:
                    user = _a.sent();
                    (0, chai_1.expect)(user).to.exist;
                    (0, chai_1.expect)(user === null || user === void 0 ? void 0 : user.username).to.equal(userData.username);
                    return [4 /*yield*/, bcrypt_1.default.compare(userData.password, (user === null || user === void 0 ? void 0 : user.password) || '')];
                case 4:
                    isPasswordCorrect = _a.sent();
                    (0, chai_1.expect)(isPasswordCorrect).to.be.true;
                    return [2 /*return*/];
            }
        });
    }); });
});
