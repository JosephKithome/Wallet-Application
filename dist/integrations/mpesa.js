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
class MpesaUtilityService {
    constructor() {
        // This file is part of of the  payment integrations for the Wallet application
        // These includes the bulk SMS messages
        // Payment Integrations including MPESA for C2B and B2B payments
        this.generateMpesaToken = (payload) => __awaiter(this, void 0, void 0, function* () {
            // TODO: implement this functionimport { Value } from '@nestjs/common';
        });
        this.sendMoneyC2B = (payload) => __awaiter(this, void 0, void 0, function* () {
            // TODO: implement this function
        });
        this.queryTransactionStatus = (transID) => __awaiter(this, void 0, void 0, function* () {
            // TODO: implement this function
        });
    }
}
