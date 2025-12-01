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
}
