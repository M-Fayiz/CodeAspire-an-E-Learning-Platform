"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateService = void 0;
const path_1 = __importDefault(require("path"));
const error_message_const_1 = require("../../const/error-message.const");
const http_status_const_1 = require("../../const/http-status.const");
const objectId_1 = require("../../mongoose/objectId");
const generateCerteficateId_util_1 = require("../../utils/generateCerteficateId.util");
const generateCertificate_util_1 = __importDefault(require("../../utils/generateCertificate.util"));
const htmlToPdf_util_1 = require("../../utils/htmlToPdf.util");
const fs_1 = __importDefault(require("fs"));
const http_error_1 = require("../../utils/http-error");
const uploadPdfToS3_util_1 = require("../../utils/uploadPdfToS3.util");
const notification_template_1 = require("../../template/notification.template");
const notification_dto_1 = require("../../dtos/notification.dto");
class CertificateService {
    constructor(_certificateRepository, _userRepository, _courseRepository, _notificatioinRepository) {
        this._certificateRepository = _certificateRepository;
        this._userRepository = _userRepository;
        this._courseRepository = _courseRepository;
        this._notificatioinRepository = _notificatioinRepository;
    }
    async createCertificate(learnerId, courseId, programmTitle) {
        const learner_Id = (0, objectId_1.parseObjectId)(learnerId);
        const course_id = (0, objectId_1.parseObjectId)(courseId);
        console.log(learner_Id, course_id);
        if (!learner_Id || !course_id) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.INVALID_ID);
        }
        const [learner, course] = await Promise.all([
            this._userRepository.findUser({ _id: learner_Id }),
            this._courseRepository.findCourse(course_id),
        ]);
        if (!learner || !course) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.ITEM_NOT_FOUND);
        }
        const certId = (0, generateCerteficateId_util_1.generateCertificateId)();
        const issuedDate = new Date().toLocaleDateString("en-IN");
        const certificateDate = {
            certId: certId,
            courseName: programmTitle,
            issuedDate: issuedDate,
            studentName: learner.name,
        };
        const html = (0, generateCertificate_util_1.default)(certificateDate);
        const tempPath = path_1.default.join(process.cwd(), "src", "temp", `${certId}.pdf`);
        const previewPath = path_1.default.join(process.cwd(), "src", "temp", `${certId}-preview.png`);
        await (0, htmlToPdf_util_1.htmlToPdf)(html, tempPath, previewPath);
        const s3Key = await (0, uploadPdfToS3_util_1.uploadPdfToS3)(tempPath, `${certId}.pdf`);
        const previewKey = await (0, uploadPdfToS3_util_1.uploadImageToS3)(previewPath, `${certId}-preview.png`);
        fs_1.default.unlinkSync(tempPath);
        fs_1.default.unlinkSync(previewPath);
        const CertificateData = {
            learnerId: learner_Id,
            courseId: course_id,
            programmTitle: programmTitle,
            certificateId: certId,
            certificateUrl: s3Key,
            preview_image: previewKey,
            issuedDate: new Date(),
        };
        const createdCertificate = await this._certificateRepository.createCertificate(CertificateData);
        const notification = notification_template_1.NotificationTemplates.CourseCompletionCertificate(learner_Id, course.title);
        const createdNotification = await this._notificatioinRepository.createNotification(notification);
        return {
            certificate: createdCertificate,
            notification: (0, notification_dto_1.notificationDto)(createdNotification),
        };
    }
    async listCertificate(learnerId) {
        const learner_id = (0, objectId_1.parseObjectId)(learnerId);
        if (!learner_id) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.INVALID_ID);
        }
        const certificates = await this._certificateRepository.listCertificate(learner_id);
        if (!certificates) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.ITEM_NOT_FOUND);
        }
        return certificates;
    }
}
exports.CertificateService = CertificateService;
