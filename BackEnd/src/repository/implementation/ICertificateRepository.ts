import { Types } from "mongoose";
import {
  CertificateModel,
  ICertificateModel,
} from "../../models/certificate.model";
import { ICertificate } from "../../types/certificate.type";
import { BaseRepository } from "../baseRepository";
import { ICertificateRepository } from "../interface/ICertificateRepository";

export class CertificateRepository
  extends BaseRepository<ICertificateModel>
  implements ICertificateRepository
{
  constructor() {
    super(CertificateModel);
  }
  async createCertificate(
    certificateDatas: ICertificate,
  ): Promise<ICertificateModel> {
    return await this.create(certificateDatas);
  }
  async listCertificate(learnerId: Types.ObjectId): Promise<ICertificateModel[]|null> {
    return await this.find({learnerId:learnerId})
  }
  async learnerTotalCertificate(learnerId: Types.ObjectId): Promise<number> {
    return await this.countDocuments({learnerId:learnerId})
  }
}
