import { Types } from "mongoose";
import { ICertificateModel } from "../../models/certificate.model";
import { ICertificate } from "../../types/certificate.type";

export interface ICertificateRepository {
  createCertificate(certificateDatas: ICertificate): Promise<ICertificateModel>;
  listCertificate(
    learnerId: Types.ObjectId,
  ): Promise<ICertificateModel[] | null>;
  learnerTotalCertificate(learnerId: Types.ObjectId): Promise<number>;
}
