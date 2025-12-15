"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const env_config_1 = require("./env.config");
const redisClient = (0, redis_1.createClient)({
    url: env_config_1.env.REDIS_URL,
    socket: {
        connectTimeout: 10000,
    },
});
redisClient.on("connect", () => {
    console.log("🛜 Redis connected");
});
redisClient.on("error", (err) => {
    console.error("❌ Redis connection error", err);
});
redisClient.connect();
exports.default = redisClient;
