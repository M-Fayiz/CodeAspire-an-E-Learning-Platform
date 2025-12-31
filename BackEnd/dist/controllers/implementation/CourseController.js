"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseController = void 0;
const http_status_const_1 = require("../../const/http-status.const");
const response_util_1 = require("../../utils/response.util");
const error_message_const_1 = require("../../const/error-message.const");
const socket_utils_1 = require("../../utils/socket.utils");
class CourseController {
    constructor(_courseService) {
        this._courseService = _courseService;
        this.addCourse = async (req, res, next) => {
            try {
                const createdCourseData = await this._courseService.createCourses(req.body.courseData);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { createdCourseData }));
            }
            catch (error) {
                next(error);
            }
        };
        this.updateCourse = async (req, res, next) => {
            try {
                const courseId = req.params.id;
                const updatedPart = req.query.course_part;
                const courseData = req.body;
                console.log(courseId, updatedPart, courseData);
                const updatedCourseData = await this._courseService.updateCourseData(courseId, courseData, updatedPart);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { updatedCourseData }));
            }
            catch (error) {
                next(error);
            }
        };
        this.fetchCourse = async (req, res, next) => {
            try {
                const { search, category, subcategory, level, page = 1, limit = 1, learnerId, } = req.query;
                const { courseData, totalPage } = await this._courseService.fetchCourses(Number(page || 1), Number(limit || 6), search, category, subcategory, level, learnerId);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { courseData, totalPage }));
            }
            catch (error) {
                next(error);
            }
        };
        this.getCourse = async (req, res, next) => {
            try {
                const { courseId } = req.params;
                const { learnerId } = req.query;
                const { courseDetails, enrolledId } = await this._courseService.getCourse(courseId, learnerId);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { courseDetails, enrolledId }));
            }
            catch (error) {
                next(error);
            }
        };
        this.getMentorDraftedCourseList = async (req, res, next) => {
            try {
                const { mentorId, search, page } = req.query;
                console.log("mentor Id : ", mentorId);
                const draftCoursList = await this._courseService.getDraftedCourses(search, page, mentorId);
                res.status(http_status_const_1.HttpStatus.OK).json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, {
                    courseData: draftCoursList?.courseData,
                    totalPage: draftCoursList?.totalPage,
                }));
            }
            catch (error) {
                next(error);
            }
        };
        this.addSession = async (req, res, next) => {
            try {
                const { courseId } = req.params;
                const { session } = req.body;
                const addedSessionData = await this._courseService.addSessions(courseId, session);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { addedSessionData }));
            }
            catch (error) {
                next(error);
            }
        };
        this.addLecture = async (req, res, next) => {
            try {
                const { courseId, sessionId } = req.params;
                const { lecture } = req.body;
                const addedLectureData = await this._courseService.addLectures(courseId, sessionId, lecture);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { addedLectureData }));
            }
            catch (error) {
                next(error);
            }
        };
        this.editLecture = async (req, res, next) => {
            try {
                const { courseId, lectureId, sessionId } = req.params;
                const { lecture } = req.body;
                const updatedData = await this._courseService.editLecture(courseId, sessionId, lectureId, lecture);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { updatedData }));
            }
            catch (error) {
                next(error);
            }
        };
        this.updateBaseInfo = async (req, res, next) => {
            try {
                const { courseId } = req.params;
                const { courseData } = req.body;
                const updatedData = await this._courseService.updateBaseCourseInfo(courseId, courseData);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { updatedData }));
            }
            catch (error) {
                next(error);
            }
        };
        this.getAdminCoursList = async (req, res, next) => {
            try {
                const { search, page } = req.query;
                const coursList = await this._courseService.getAdminCourse(search, Number(page));
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { coursList }));
            }
            catch (error) {
                next(error);
            }
        };
        this.getCourseDetails = async (req, res, next) => {
            try {
                const { courseId } = req.params;
                const courseDetails = await this._courseService.getCourseDetails(courseId);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { courseDetails }));
            }
            catch (error) {
                next(error);
            }
        };
        this.approveCourse = async (req, res, next) => {
            try {
                const { courseId } = req.params;
                const status = await this._courseService.approveCourse(courseId);
                (0, socket_utils_1.sendNotification)(status.notifyDTO.userId, status.notifyDTO);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { status: status.status }));
            }
            catch (error) {
                next(error);
            }
        };
        this.rejectCourse = async (req, res, next) => {
            try {
                const { courseId } = req.params;
                const { feedBack, email } = req.body;
                const status = await this._courseService.rejectCourse(courseId, feedBack, email);
                (0, socket_utils_1.sendNotification)(status.notifyDTO.userId, status.notifyDTO);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { status }));
            }
            catch (error) {
                next(error);
            }
        };
        this.publishCourse = async (req, res, next) => {
            try {
                const { courseId } = req.params;
                const status = await this._courseService.publishCourse(courseId);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { status }));
            }
            catch (error) {
                next(error);
            }
        };
        this.getCourseListSlot = async (req, res, next) => {
            try {
                const { mentorId } = req.params;
                const courseList = await this._courseService.fetchCourseListForSlot(mentorId);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { courseList }));
            }
            catch (error) {
                next(error);
            }
        };
        this.getCourseFormData = async (req, res, next) => {
            try {
                const { courseId } = req.params;
                const user = req.user;
                const courseFormData = await this._courseService.getCourseFormData(courseId, user);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { courseFormData }));
            }
            catch (error) {
                next(error);
            }
        };
        this.removeSession = async (req, res, next) => {
            try {
                const { courseId, sessionId } = req.params;
                console.log(courseId, "-    -", sessionId);
                const removedSessionData = await this._courseService.removeSession(courseId, sessionId);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { removedSessionData }));
            }
            catch (error) {
                next(error);
            }
        };
        this.getAdminCourseDetails = async (req, res, next) => {
            try {
                const { courseId } = req.params;
                const courseDetails = await this._courseService.getAdminCourseDetails(courseId);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { courseDetails }));
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.CourseController = CourseController;
