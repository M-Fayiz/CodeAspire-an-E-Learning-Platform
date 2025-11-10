import { Types } from "mongoose";
import { getIO } from "../socket.io/socketEvent";
import { INotificationDTO } from "../types/dtos.type/notification.dto.types";
import redisClient from "../config/redis.config";
import { redisPrefix } from "../const/redisKey";

export const sendNotification = async (
  userId: Types.ObjectId,
  data: INotificationDTO,
) => {
  const io = getIO();
  let user_ID = String(userId);
  const isOnline = await redisClient.hGet(redisPrefix.ONLINE_USERS, user_ID);

  io.to(`user:${userId}`).emit("notification", data);

  console.log(`Notification sent to ${userId}: ${data}`);
};
