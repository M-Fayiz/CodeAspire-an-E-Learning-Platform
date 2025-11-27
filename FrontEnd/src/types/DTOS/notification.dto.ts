export interface INotificationDTO {
  _id: string;
  userId: string;
  message: string;
  isRead: boolean;
  title: string;
  type: notificationType;
  link?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export type notificationType = "info" | "warning" | "success" | "error";
