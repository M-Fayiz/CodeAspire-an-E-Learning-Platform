"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrolledService = void 0;
const error_message_1 = require("../../const/error-message");
const http_status_1 = require("../../const/http-status");
const objectId_1 = require("../../mongoose/objectId");
const http_error_1 = require("../../utils/http-error");
const course_dtos_1 = require("../../dtos/course.dtos");
const enrolled_dto_1 = require("../../dtos/enrolled.dto");
const enrollment_types_1 = require("../../types/enrollment.types");
const courseDashboard_dto_1 = require("../../dtos/courseDashboard.dto");
const mentorDashboard_dto_1 = require("../../dtos/mentorDashboard.dto");
const dashFilterGenerator_utils_1 = require("../../utils/dashFilterGenerator.utils");
const transaction_1 = require("../../const/transaction");
const dateBuilder_1 = require("../../utils/dateBuilder");
const learnerDashnoard_dto_1 = require("../../dtos/learnerDashnoard.dto");
class EnrolledService {
    constructor(_erolledRepository, _courseRepository, _transactionRepository, _userRepository, _certificateRepository, _slotbookingRepository) {
        this._erolledRepository = _erolledRepository;
        this._courseRepository = _courseRepository;
        this._transactionRepository = _transactionRepository;
        this._userRepository = _userRepository;
        this._certificateRepository = _certificateRepository;
        this._slotbookingRepository = _slotbookingRepository;
    }
    async getEnrolledCourses(learnerId) {
        const learner_id = (0, objectId_1.parseObjectId)(learnerId);
        if (!learner_id) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.NOT_FOUND, error_message_1.HttpResponse.INVALID_ID);
        }
        const enrolledData = await this._erolledRepository.getEnrolledCourses(learner_id);
        if (!enrolledData) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.NOT_FOUND, error_message_1.HttpResponse.ITEM_NOT_FOUND);
        }
        const populatedEnrolledCourse = await Promise.all(enrolledData.map(async (course) => {
            const data = await this._courseRepository.findCourse(course.courseId);
            if (!data)
                return null;
            const populatedCourse = (0, course_dtos_1.formCourseDto)(data);
            return {
                ...course,
                courseId: populatedCourse,
            };
        }));
        return populatedEnrolledCourse.map((course) => (0, enrolled_dto_1.enrolledListDTO)(course));
    }
    async getEnrolledCourseDetails(enrolledId) {
        const enrolled_Id = (0, objectId_1.parseObjectId)(enrolledId);
        if (!enrolled_Id) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.NOT_FOUND, error_message_1.HttpResponse.INVALID_ID);
        }
        const enrolledData = await this._erolledRepository.getEnrolledCOurseDetails(enrolled_Id);
        if (!enrolledData) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.NOT_FOUND, error_message_1.HttpResponse.INVALID_ID);
        }
        const courseData = await this._courseRepository.findCourse(enrolledData.courseId);
        const populatedCourse = (0, course_dtos_1.formCourseDto)(courseData);
        return (0, enrolled_dto_1.enrolledCourseDetailDTO)(enrolledData, populatedCourse);
    }
    async updatedProgress(enrolledId, lectureId, lastSession) {
        const enrolledObjectId = (0, objectId_1.parseObjectId)(enrolledId);
        const lectureObjectId = (0, objectId_1.parseObjectId)(lectureId);
        const lastSession_id = (0, objectId_1.parseObjectId)(lastSession);
        if (!enrolledObjectId || !lectureObjectId) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.BAD_REQUEST, error_message_1.HttpResponse.INVALID_ID);
        }
        // atomic add (no duplicates)
        const updatedEnrollment = await this._erolledRepository.updateEnrolledData(enrolledObjectId, {
            $addToSet: { "progress.completedLectures": lectureObjectId },
            $set: {
                "progress.lastAccessedLecture": lectureObjectId,
                "progress.lastAccessedSession": lastSession_id,
            },
        });
        if (!updatedEnrollment) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.NOT_FOUND, error_message_1.HttpResponse.ITEM_NOT_FOUND);
        }
        const course = await this._courseRepository.getCourse(updatedEnrollment.courseId);
        let totalLectures = 0;
        for (let session of course?.sessions) {
            totalLectures += session.lectures.length;
        }
        const completedCount = updatedEnrollment.progress.completedLectures.length;
        const completionPercentage = (completedCount / totalLectures) * 100;
        const status = completionPercentage === 100
            ? enrollment_types_1.completionStatus.COMPLETED
            : enrollment_types_1.completionStatus.IN_PROGRESS;
        const finalEnrollment = await this._erolledRepository.updateEnrolledData(enrolledObjectId, {
            $set: {
                "progress.completionPercentage": completionPercentage,
                courseStatus: status,
            },
        });
        return finalEnrollment?.progress ?? null;
    }
    async addRating(enroledId, value) {
        const enrolled_id = (0, objectId_1.parseObjectId)(enroledId);
        if (!enrolled_id) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.BAD_REQUEST, error_message_1.HttpResponse.INVALID_ID);
        }
        const updatedData = await this._erolledRepository.addRating(enrolled_id, value);
        if (!updatedData?.rating) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.INTERNAL_SERVER_ERROR, error_message_1.HttpResponse.SERVER_ERROR);
        }
        return updatedData.rating;
    }
    async getCourseEnrolledDashboardData(courseId, mentorId) {
        const course_id = (0, objectId_1.parseObjectId)(courseId);
        const mentor_id = (0, objectId_1.parseObjectId)(mentorId);
        if (!course_id || !mentor_id) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.BAD_REQUEST, error_message_1.HttpResponse.INVALID_ID);
        }
        const [studentsAndRating, course, revenue] = await Promise.all([
            this._erolledRepository.getEnrolledDasgboardData(course_id, mentor_id),
            this._courseRepository.findCourse(course_id),
            this._transactionRepository.getCourseDashboardRevenue(course_id),
        ]);
        if (!studentsAndRating || !course || !revenue) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.NOT_FOUND, error_message_1.HttpResponse.ITEM_NOT_FOUND);
        }
        const { avgRating = 0, totalStudents = 0 } = studentsAndRating[0] || {};
        return (0, courseDashboard_dto_1.courseDashboardDTO)(totalStudents, avgRating, course, revenue[0]);
    }
    async getTrendingCourseGraph(courseId, filter, startDate, endDate) {
        const course_id = (0, objectId_1.parseObjectId)(courseId);
        if (!course_id) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.BAD_REQUEST, error_message_1.HttpResponse.INVALID_ID);
        }
        let { start, end } = (0, dashFilterGenerator_utils_1.timeFilter)(filter, startDate, endDate);
        const filterChart = {
            courseId: course_id,
            start: start,
            end: end,
        };
        const graph = await this._erolledRepository.getCourseEnrollmentTrend(course_id, filterChart);
        return graph.map((data) => (0, courseDashboard_dto_1.chartTrendDTO)(data));
    }
    async getMentorDashboardData(mentorId) {
        const mentor_id = (0, objectId_1.parseObjectId)(mentorId);
        if (!mentor_id) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.BAD_REQUEST, error_message_1.HttpResponse.INVALID_ID);
        }
        const [studentsAndRating, topCourse, revanue] = await Promise.all([
            this._erolledRepository.getMentorDashboardData(mentor_id),
            this._erolledRepository.getTopSellingCourse(mentor_id),
            this._transactionRepository.getMentorTotalRevenue(mentor_id),
        ]);
        return (0, mentorDashboard_dto_1.mentorDashboardDTO)(studentsAndRating[0], topCourse, revanue);
    }
    async getRevenueGraph(filter, mentorId) {
        const dateMatch = (0, dateBuilder_1.buildDateFilter)(filter);
        const matchStage = {
            ...dateMatch,
        };
        if (mentorId) {
            const mentor_id = (0, objectId_1.parseObjectId)(mentorId);
            if (!mentor_id) {
                throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.BAD_REQUEST, error_message_1.HttpResponse.INVALID_ID);
            }
            matchStage.mentorId = mentor_id;
        }
        const slotRevenue = await this._transactionRepository.getMentorRevanueONSlot({
            ...matchStage,
            paymentType: transaction_1.TransactionType.SLOT_BOOKING,
        });
        const courseRevenue = await this._transactionRepository.getMentorRevanueONCourse({
            ...matchStage,
            paymentType: transaction_1.TransactionType.COURSE_PURCHASE,
        });
        const signedUsers = await this._userRepository.SignedUsers(dateMatch);
        return {
            slotRevanue: slotRevenue,
            courseRevanue: courseRevenue,
            signedUsers,
        };
    }
    async learnerDashboardCardData(learnerId, filter, startDate, endDate) {
        const learner_Id = (0, objectId_1.parseObjectId)(learnerId);
        if (!learner_Id) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.BAD_REQUEST, error_message_1.HttpResponse.INVALID_ID);
        }
        const [courseCard, certificateCount, slotCard] = await Promise.all([this._erolledRepository.getLearnerDashboardCourseData(learner_Id), this._certificateRepository.learnerTotalCertificate(learner_Id), this._slotbookingRepository.learnerDashboardSlotCard(learner_Id)]);
        return (0, learnerDashnoard_dto_1.learnerDashboardDetails)(courseCard[0], slotCard[0], certificateCount);
    }
}
exports.EnrolledService = EnrolledService;
