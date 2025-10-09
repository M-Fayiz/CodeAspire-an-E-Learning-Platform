import { Types } from "mongoose";
import { INotification } from "../types/notification.types";

export const NotificationTemplates = {
  courseApproval: (
    userId: Types.ObjectId,
    title: string,
    link?: string,
  ): INotification => ({
    title: `Course Approval`,
    message: `Your course "${title}" has been approved by the authority.`,
    type: "success",
    isRead: false,
    userId,
    link,
    createdAt: new Date(),
  }),
  courseRejection: (
    userId: Types.ObjectId,
    title: string,
    feedback: string,
    link?: string,
  ): INotification => ({
    title: `Course Rejection`,
    message: `Your course "${title}" has been rejected by the authority. \n due to ${feedback}`,
    type: "error",
    isRead: false,
    userId,
    link,
    createdAt: new Date(),
  }),
};
