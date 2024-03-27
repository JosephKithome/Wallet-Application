"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/auth/AuthController");
class AppRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.authController = new AuthController_1.AuthController();
        this.initializeRoutes = () => {
            this.router.post("/api/v1/user/signup", this.authController.signUp);
        };
        this.initializeRoutes();
    }
}
exports.default = new AppRouter().router;
