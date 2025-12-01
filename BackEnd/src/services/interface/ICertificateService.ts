import { ICertificateModel } from "../../models/certificate.model";

export interface ICertificateService {
  createCertificate(
    learnerId: string,
    courseId: string,
  ): Promise<ICertificateModel>;
}
