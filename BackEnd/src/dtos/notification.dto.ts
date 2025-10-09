import { INotificationModel } from "../models/notification.model";
import { INotificationDTO } from "../types/dtos.type/notification.dto.types";

export function notificationDto(data: INotificationModel): INotificationDTO {
  return {
    _id: data._id,
    title: data.title,
    message: data.message,
    isRead: data.isRead,
    type: data.type,
    userId: data.userId,
    createdAt: data.createdAt,
    link: data.link,
  };
}
