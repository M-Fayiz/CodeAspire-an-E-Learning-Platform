import { Types } from "mongoose";
import { INotification } from "../notification.types";

export interface INotificationDTO extends INotification {
  _id: Types.ObjectId;
}
