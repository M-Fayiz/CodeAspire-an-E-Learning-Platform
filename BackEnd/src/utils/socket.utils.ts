import { Types } from "mongoose";
import { getIO } from "../socket.io";
import { INotificationDTO } from "../types/dtos.type/notification.dto.types";
import redisClient from "../config/redis.config";
import { redisPrefix } from "../const/redisKey.const";

export const sendNotification = async (
  userId: Types.ObjectId,
  data: INotificationDTO,
) => {
  const io = getIO();
  let user_ID = String(userId);
  await redisClient.hGet(redisPrefix.ONLINE_USERS, user_ID);

  io.to(`user:${userId}`).emit("notification", data);
};
