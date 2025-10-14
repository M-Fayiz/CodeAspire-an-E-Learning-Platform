import { Types } from "mongoose";
import { getIO } from "../config/socket.config";
import { INotificationDTO } from "../types/dtos.type/notification.dto.types";

export const sendToUser = (userId: Types.ObjectId, data: INotificationDTO) => {
  const io = getIO();
  let user_ID = String(userId);
  io.to(user_ID).emit("notification", data);
  console.log(`Notification sent to ${userId}: ${data}`);
};
