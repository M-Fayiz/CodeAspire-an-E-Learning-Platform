"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateService = void 0;
const path_1 = __importDefault(require("path"));
const error_message_1 = require("../../const/error-message");
const http_status_1 = require("../../const/http-status");
const objectId_1 = require("../../mongoose/objectId");
const generateCerteficateId_util_1 = require("../../utils/generateCerteficateId.util");
const generateCertificate_util_1 = __importDefault(require("../../utils/generateCertificate.util"));
const htmlToPdf_util_1 = require("../../utils/htmlToPdf.util");
const fs_1 = __importDefault(require("fs"));
const http_error_1 = require("../../utils/http-error");
const uploadPdfToS3_util_1 = require("../../utils/uploadPdfToS3.util");
class CertificateService {
    constructor(_certificateRepository, _userRepository, _courseRepository) {
        this._certificateRepository = _certificateRepository;
        this._userRepository = _userRepository;
        this._courseRepository = _courseRepository;
    }
    async createCertificate(learnerId, courseId, programmTitle) {
        const learner_Id = (0, objectId_1.parseObjectId)(learnerId);
        const course_id = (0, objectId_1.parseObjectId)(courseId);
        console.log(learner_Id, course_id);
        if (!learner_Id || !course_id) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.BAD_REQUEST, error_message_1.HttpResponse.INVALID_ID);
        }
        const [learner, course] = await Promise.all([
            this._userRepository.findUser({ _id: learner_Id }),
            this._courseRepository.findCourse(course_id),
        ]);
        if (!learner || !course) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.NOT_FOUND, error_message_1.HttpResponse.ITEM_NOT_FOUND);
        }
        const certId = (0, generateCerteficateId_util_1.generateCertificateId)();
        const issuedDate = new Date().toLocaleDateString("en-IN");
        const certificateDate = {
            certId: certId,
            courseName: course.title,
            issuedDate: issuedDate,
            studentName: learner.name,
        };
        const html = (0, generateCertificate_util_1.default)(certificateDate);
        const tempPath = path_1.default.join(process.cwd(), "src", "temp", `${certId}.pdf`);
        await (0, htmlToPdf_util_1.htmlToPdf)(html, tempPath);
        const s3Key = await (0, uploadPdfToS3_util_1.uploadPdfToS3)(tempPath, `${certId}.pdf`);
        fs_1.default.unlinkSync(tempPath);
        const CertificateData = {
            learnerId: learner_Id,
            courseId: course_id,
            programmTitle: programmTitle,
            certificateId: certId,
            certificateUrl: s3Key,
            issuedDate: new Date()
        };
        const createdCertificate = await this._certificateRepository.createCertificate(CertificateData);
        return createdCertificate;
    }
}
exports.CertificateService = CertificateService;
