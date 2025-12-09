import { ICertificateModel } from "../../models/certificate.model";

export interface ICertificateService {
  createCertificate(
    learnerId: string,
    courseId: string,
    programmTitle:string
  ): Promise<ICertificateModel>;
}
