export interface INotificationDTO {
    _id:string,
  userId: string;
  message: string;
  isRead: boolean;
  title: string;
  type: "info" | "warning" | "success" | "error";
  link?: string;
  createdAt: Date;
  updatedAt?: Date;
}