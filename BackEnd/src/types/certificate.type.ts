import { Types } from "mongoose";

export interface ICertificate {
  learnerId: Types.ObjectId;
  courseId: Types.ObjectId;
  programmTitle:string
  certificateId: string;
  certificateUrl: string;
  issuedDate: Date;
  createAt?: Date;
  updatedAt?: Date;
}
