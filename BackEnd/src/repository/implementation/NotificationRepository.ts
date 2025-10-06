import { INotificationRepository } from "../interface/INotificationRepository";
import { BaseRepository } from "../baseRepository";
import {
  INotificationModel,
  NotificationModel,
} from "../../models/notification.model";

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
}
