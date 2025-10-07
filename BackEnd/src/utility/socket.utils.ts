import { getIO } from "../config/socket.config";

export const sendToUser = (userId: string, message: string) => {
  const io = getIO();
  
  io.to(userId).emit("notification", { message });
  console.log(`Notification sent to ${userId}: ${message}`);
};
