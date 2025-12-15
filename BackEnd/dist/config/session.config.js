"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionConfig = void 0;
const env_config_1 = require("./env.config");
const secrete = env_config_1.env.SESSION_SECRET;
exports.sessionConfig = {
    secret: secrete,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
};
