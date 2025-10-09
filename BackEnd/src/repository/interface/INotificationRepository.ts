import { Types } from "mongoose";
import { INotificationModel } from "../../models/notification.model";

export interface INotificationRepository {
  createNotification(
    notificationData: Partial<INotificationModel>,
  ): Promise<INotificationModel>;
  getAllNotificaton(userId: Types.ObjectId): Promise<INotificationModel[]>;
  readNotification(
    notifyId: Types.ObjectId,
  ): Promise<INotificationModel | null>;
}
