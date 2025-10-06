import { INotificationModel } from "../../models/notification.model";

export interface INotificationRepository {
  createNotification(
    notificationData: Partial<INotificationModel>,
  ): Promise<INotificationModel>;
}
