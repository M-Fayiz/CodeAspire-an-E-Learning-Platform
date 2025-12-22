import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { env } from "../config/env.config";
import { verifyAccesToken } from "../utils/jwt-token.util";
import redisClient from "../config/redis.config";
import { redisPrefix } from "../const/redisKey.const";
import { HttpResponse } from "../const/error-message.const";
import { SocketEvents } from "../const/socketEvents.const";
import { registerChatHandler } from "./chat.socket";
import { registerVideoHandlers } from "./video.socket";

interface CustomSocket extends Socket {
  data: { userId: string };
}

let io: Server;

export const intitializeSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_ORGIN,
      methods: ["GET", "POST"],
    },
  });

  io.use((socket: CustomSocket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error(HttpResponse.UNAUTHORIZED));

    try {
      const user = verifyAccesToken(token);

      socket.data.userId = user._id;
      next();
    } catch {
      next(new Error(HttpResponse.UNAUTHORIZED));
    }
  });

  io.on(SocketEvents.CONNECT, async (socket: CustomSocket) => {
    const userId = socket.data.userId;

    socket.join(`user:${userId}`);

    await redisClient.hSet(redisPrefix.ONLINE_USERS, userId, socket.id);
    io.emit(SocketEvents.USER_ONLINE, userId);

    registerChatHandler(io, socket);
    registerVideoHandlers(io, socket);

    socket.on(SocketEvents.DISCONNECT, async () => {
      await redisClient.hDel(
        redisPrefix.OFFLINE_USERS ?? redisPrefix.ONLINE_USERS,
        userId,
      );
      await redisClient.hDel(redisPrefix.ONLINE_USERS, userId);
      io.emit(SocketEvents.USER_OFFLINE, userId);
      console.log("user disconnected", userId);
    });
  });

  return io;
};

export const getIO = () => io;
