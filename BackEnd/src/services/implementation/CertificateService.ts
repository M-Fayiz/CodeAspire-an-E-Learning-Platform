import path from "path";
import { HttpResponse } from "../../const/error-message.const";
import { HttpStatus } from "../../const/http-status.const";
import { ICertificateModel } from "../../models/certificate.model";
import { parseObjectId } from "../../mongoose/objectId";
import { ICertificateRepository } from "../../repository/interface/ICertificateRepository";
import { ICourseRepository } from "../../repository/interface/ICourseRepository";
import { IUserRepo } from "../../repository/interface/IUserRepo";
import { generateCertificateId } from "../../utils/generateCerteficateId.util";
import generateCertificateHtml, {
  generateCertificateHTML,
} from "../../utils/generateCertificate.util";
import { htmlToPdf } from "../../utils/htmlToPdf.util";
import fs from "fs";
import { createHttpError } from "../../utils/http-error";
import { ICertificateService } from "../interface/ICertificateService";
import { uploadImageToS3, uploadPdfToS3 } from "../../utils/uploadPdfToS3.util";
import { ICertificate } from "../../types/certificate.type";
import { NotificationTemplates } from "../../template/notification.template";
import { INotificationRepository } from "../../repository/interface/INotificationRepository";
import { INotificationDTO } from "../../types/dtos.type/notification.dto.types";
import { notificationDto } from "../../dtos/notification.dto";
export class CertificateService implements ICertificateService {
  constructor(
    private _certificateRepository: ICertificateRepository,
    private _userRepository: IUserRepo,
    private _courseRepository: ICourseRepository,
    private _notificatioinRepository: INotificationRepository,
  ) {}

  async createCertificate(
    learnerId: string,
    courseId: string,
    programmTitle: string,
  ): Promise<{
    certificate: ICertificateModel;
    notification: INotificationDTO;
  }> {
    const learner_Id = parseObjectId(learnerId);
    const course_id = parseObjectId(courseId);
    console.log(learner_Id, course_id);
    if (!learner_Id || !course_id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }

    const [learner, course] = await Promise.all([
      this._userRepository.findUser({ _id: learner_Id }),
      this._courseRepository.findCourse(course_id),
    ]);

    if (!learner || !course) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.ITEM_NOT_FOUND);
    }
    const certId = generateCertificateId();
    const issuedDate = new Date().toLocaleDateString("en-IN");

    const certificateDate: generateCertificateHTML = {
      certId: certId,
      courseName: programmTitle,
      issuedDate: issuedDate,
      studentName: learner.name,
    };

    const html = generateCertificateHtml(certificateDate);

    const tempPath = path.join(process.cwd(), "src", "temp", `${certId}.pdf`);
    const previewPath = path.join(
      process.cwd(),
      "src",
      "temp",
      `${certId}-preview.png`,
    );

    await htmlToPdf(html, tempPath, previewPath);

    const s3Key = await uploadPdfToS3(tempPath, `${certId}.pdf`);
    const previewKey = await uploadImageToS3(
      previewPath,
      `${certId}-preview.png`,
    );
    fs.unlinkSync(tempPath);
    fs.unlinkSync(previewPath);
    const CertificateData: ICertificate = {
      learnerId: learner_Id,
      courseId: course_id,
      programmTitle: programmTitle,
      certificateId: certId,
      certificateUrl: s3Key,
      preview_image: previewKey,
      issuedDate: new Date(),
    };

    const createdCertificate =
      await this._certificateRepository.createCertificate(CertificateData);

    const notification = NotificationTemplates.CourseCompletionCertificate(
      learner_Id,
      course.title,
    );

    const createdNotification =
      await this._notificatioinRepository.createNotification(notification);
    return {
      certificate: createdCertificate,
      notification: notificationDto(createdNotification),
    };
  }
  async listCertificate(learnerId: string): Promise<ICertificateModel[]> {
    const learner_id = parseObjectId(learnerId);
    if (!learner_id) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.INVALID_ID);
    }
    const certificates =
      await this._certificateRepository.listCertificate(learner_id);
    if (!certificates) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.ITEM_NOT_FOUND);
    }
    return certificates;
  }
}
