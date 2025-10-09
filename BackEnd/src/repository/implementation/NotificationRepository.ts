import { INotificationRepository } from "../interface/INotificationRepository";
import { BaseRepository } from "../baseRepository";
import {
  INotificationModel,
  NotificationModel,
} from "../../models/notification.model";
import { Types } from "mongoose";

export class NotificationRepository
  extends BaseRepository<INotificationModel>
  implements INotificationRepository
{
  constructor() {
    super(NotificationModel);
  }

  async createNotification(
    notificationData: Partial<INotificationModel>,
  ): Promise<INotificationModel> {
    return await this.create(notificationData);
  }
  async getAllNotificaton(
    userId: Types.ObjectId,
  ): Promise<INotificationModel[]> {
    return await this.findAll({ userId: userId });
  }
  async readNotification(
    notifyId: Types.ObjectId,
  ): Promise<INotificationModel | null> {
    return await this.findByIDAndUpdate(notifyId, { isRead: true });
  }
}
