import mongoose, { Document, Schema, Types } from "mongoose";
import { INotification } from "../types/notification.types";
import { DbModelName } from "../const/modelName";

export interface INotificationModel
  extends Document<Types.ObjectId>,
    Omit<INotification, "_id"> {}

const NotificationSchema = new mongoose.Schema<INotificationModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: DbModelName.USER,
      required: true,
    },
    message: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
    },
    type: {
      type: String,
      enum: ["info", "warning", "success", "error"],
    },
    title: {
      type: String,
    },
  },
  { timestamps: true },
);

export const NotificationModel = mongoose.model<INotificationModel>(
  DbModelName.NOTIFICATION,
  NotificationSchema,
);
