"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsSetUp = void 0;
const env_config_1 = require("./env.config");
exports.corsSetUp = {
    origin: env_config_1.env.CLIENT_ORGIN,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Authorization"],
};
