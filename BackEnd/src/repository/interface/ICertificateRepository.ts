import { ICertificateModel } from "../../models/certificate.model";
import { ICertificate } from "../../types/certificate.type";

export interface ICertificateRepository {
  createCertificate(certificateDatas: ICertificate): Promise<ICertificateModel>;
}
