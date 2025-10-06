import { Types } from "mongoose";

export interface INotification {
  userId: Types.ObjectId;
  message: string;
  isRead: boolean;
  title: string;
  type: "info" | "warning" | "success" | "error";
  link?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
