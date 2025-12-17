import { ICertificateModel } from "../../models/certificate.model";
import { INotificationDTO } from "../../types/dtos.type/notification.dto.types";

export interface ICertificateService {
  createCertificate(
    learnerId: string,
    courseId: string,
    programmTitle:string
  ): Promise<{certificate:ICertificateModel,notification :INotificationDTO}>;
  listCertificate(learnerId:string):Promise<ICertificateModel[]>
}
