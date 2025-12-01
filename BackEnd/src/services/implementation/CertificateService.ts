import { HttpResponse } from "../../const/error-message";
import { HttpStatus } from "../../const/http-status";
import { ICertificateModel } from "../../models/certificate.model";
import { parseObjectId } from "../../mongoose/objectId";
import { ICertificateRepository } from "../../repository/interface/ICertificateRepository";
import { ICourseRepository } from "../../repository/interface/ICourseRepository";
import { IUserRepo } from "../../repository/interface/IUserRepo";
import { generateCertificateId } from "../../utils/generateCerteficateId.util";
import generateCertificateHtml, {
  generateCertificateHTML,
} from "../../utils/generateCertificate.util";

import { createHttpError } from "../../utils/http-error";
import { ICertificateService } from "../interface/ICertificateService";

export class CertificateService implements ICertificateService {
  constructor(
    private _certificateRepository: ICertificateRepository,
    private _userRepository: IUserRepo,
    private _courseRepository: ICourseRepository,
  ) {}

  async createCertificate(
    learnerId: string,
    courseId: string,
  ): Promise<ICertificateModel> {
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
      courseName: course.title,
      issuedDate: issuedDate,
      studentName: learner.name,
    };

    const html = generateCertificateHtml(certificateDate);
    console.log(html);
  }
}
