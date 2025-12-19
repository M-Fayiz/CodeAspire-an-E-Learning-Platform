"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const socket_io_1 = require("../socket.io");
const redis_config_1 = __importDefault(require("../config/redis.config"));
const redisKey_1 = require("../const/redisKey");
const sendNotification = async (userId, data) => {
    const io = (0, socket_io_1.getIO)();
    let user_ID = String(userId);
    await redis_config_1.default.hGet(redisKey_1.redisPrefix.ONLINE_USERS, user_ID);
    io.to(`user:${userId}`).emit("notification", data);
};
exports.sendNotification = sendNotification;
