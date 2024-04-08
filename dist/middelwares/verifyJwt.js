"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Token verification middleware
const verifyToken = (req, resp, next) => {
    if (!req.headers.authorization) {
        return resp.status(401).send("Unauthorized request!!");
    }
    let token = req.headers.authorization.split(' ')[1];
    //check if the token is null
    if (token == "null") {
        resp.status(401).send("Unauthorized");
    }
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(token, "secretkey");
    }
    catch (error) {
        resp.status(401).send("Unauthorized");
        return;
    }
    if (!payload || typeof payload === 'string') {
        resp.status(401).send("Unauthorized");
        return;
    }
    req.userId = payload.subject;
    next();
};
