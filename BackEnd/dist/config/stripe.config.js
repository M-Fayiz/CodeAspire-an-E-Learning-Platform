"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
const stripe_1 = __importDefault(require("stripe"));
const env_config_1 = require("./env.config");
let stripe = null;
exports.stripe = stripe;
if (env_config_1.env.STRIPE_SECRET_KEY) {
    exports.stripe = stripe = new stripe_1.default(env_config_1.env.STRIPE_SECRET_KEY);
}
else {
    console.warn("⚠️ Stripe disabled: missing STRIPE_SECRET_KEY");
}
