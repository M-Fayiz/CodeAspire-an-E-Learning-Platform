import mongoose, { Document, Types } from "mongoose";
import { ICertificate } from "../types/certificate.type";
import { DbModelName } from "../const/modelName";

export interface ICertificateModel
  extends Document<Types.ObjectId>,
    Omit<ICertificate, "_id"> {}

const CertificateSchema = new mongoose.Schema<ICertificateModel>(
  {
    learnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DbModelName.USER,
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DbModelName.COURSE,
      required: true,
    },
    certificateId: { type: String, required: true, unique: true },
    certificateUrl: { type: String, required: true },
    issuedDate: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const CertificateModel = mongoose.model(
  DbModelName.CERTIFICATE,
  CertificateSchema,
);
