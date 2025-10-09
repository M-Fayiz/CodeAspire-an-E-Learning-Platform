import { Types } from "mongoose";
import { HttpResponse } from "../../const/error-message";
import { HttpStatus } from "../../const/http-status";
import { notificationDto } from "../../dtos/notification.dto";
import { parseObjectId } from "../../mongoose/objectId";
import { INotificationRepository } from "../../repository/interface/INotificationRepository";
import { INotificationDTO } from "../../types/dtos.type/notification.dto.types";
import { createHttpError } from "../../utility/http-error";
import { INotificationService } from "../interface/INotificationService";

export class NotificationService implements INotificationService {
  constructor(private _notificationRepository: INotificationRepository) {}

  async getAllNotification(userId: string): Promise<INotificationDTO[]> {
    const user_Id = parseObjectId(userId);
    if (!user_Id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }

    const notifyData =
      await this._notificationRepository.getAllNotificaton(user_Id);

    return notifyData.map((notif) => notificationDto(notif));
  }
  async readNotification(notifyId: string): Promise<Types.ObjectId | null> {
    const notify_id = parseObjectId(notifyId);
    if (!notify_id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }
    const updatedDate =
      await this._notificationRepository.readNotification(notify_id);

    return updatedDate?._id ? updatedDate?._id : null;
  }
}
