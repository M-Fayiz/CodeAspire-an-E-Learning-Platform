"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.intitializeSocket = void 0;
const socket_io_1 = require("socket.io");
const env_config_1 = require("../config/env.config");
const jwt_token_util_1 = require("../utils/jwt-token.util");
const redis_config_1 = __importDefault(require("../config/redis.config"));
const redisKey_const_1 = require("../const/redisKey.const");
const error_message_const_1 = require("../const/error-message.const");
const socketEvents_const_1 = require("../const/socketEvents.const");
const chat_socket_1 = require("./chat.socket");
const video_socket_1 = require("./video.socket");
let io;
const intitializeSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: env_config_1.env.CLIENT_ORGIN,
            methods: ["GET", "POST"],
        },
    });
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token)
            return next(new Error(error_message_const_1.HttpResponse.UNAUTHORIZED));
        try {
            const user = (0, jwt_token_util_1.verifyAccesToken)(token);
            socket.data.userId = user._id;
            next();
        }
        catch {
            next(new Error(error_message_const_1.HttpResponse.UNAUTHORIZED));
        }
    });
    io.on(socketEvents_const_1.SocketEvents.CONNECT, async (socket) => {
        const userId = socket.data.userId;
        socket.join(`user:${userId}`);
        await redis_config_1.default.hSet(redisKey_const_1.redisPrefix.ONLINE_USERS, userId, socket.id);
        io.emit(socketEvents_const_1.SocketEvents.USER_ONLINE, userId);
        (0, chat_socket_1.registerChatHandler)(io, socket);
        (0, video_socket_1.registerVideoHandlers)(io, socket);
        socket.on(socketEvents_const_1.SocketEvents.DISCONNECT, async () => {
            await redis_config_1.default.hDel(redisKey_const_1.redisPrefix.OFFLINE_USERS ?? redisKey_const_1.redisPrefix.ONLINE_USERS, userId);
            await redis_config_1.default.hDel(redisKey_const_1.redisPrefix.ONLINE_USERS, userId);
            io.emit(socketEvents_const_1.SocketEvents.USER_OFFLINE, userId);
            console.log("user disconnected", userId);
        });
    });
    return io;
};
exports.intitializeSocket = intitializeSocket;
const getIO = () => io;
exports.getIO = getIO;
