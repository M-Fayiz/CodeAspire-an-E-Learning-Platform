import mongoose, { Document, Types } from "mongoose";
import { INotification } from "../types/notification.types";

export interface INotificationModel
  extends Document<Types.ObjectId>,
    Omit<INotification, "_id"> {}

const NotificationSchema = new mongoose.Schema<INotificationModel>(
  {
    userId: {
      Type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
      type : {
        type : String ,
        enum : ["INFO","WARNING" , "SUCCESS" , "ERROR" ]
     },
    title: {
      type: String,
    },
  },
  { timestamps: true },
);


export  const NotificationModel=mongoose.model<INotificationModel>('notification',NotificationSchema)