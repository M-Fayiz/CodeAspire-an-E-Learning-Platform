import { Types } from "mongoose";
import { INotificationDTO } from "../../types/dtos.type/notification.dto.types";

export interface INotificationService {
  getAllNotification(userId: string): Promise<INotificationDTO[]>;
  readNotification(notifyId: string): Promise<Types.ObjectId | null>;
}
