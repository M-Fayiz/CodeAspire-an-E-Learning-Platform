"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewService = void 0;
const objectId_1 = require("../../mongoose/objectId");
const http_error_1 = require("../../utils/http-error");
const http_status_const_1 = require("../../const/http-status.const");
const error_message_const_1 = require("../../const/error-message.const");
const review_dto_1 = require("../../dtos/review.dto");
class ReviewService {
    constructor(_reviewRepository) {
        this._reviewRepository = _reviewRepository;
    }
    async createReview(courseId, learnerId, comment, rating) {
        let course_Id = (0, objectId_1.parseObjectId)(courseId);
        let learner_Id = (0, objectId_1.parseObjectId)(learnerId);
        if (!course_Id || !learner_Id) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.INVALID_ID);
        }
        const reviewData = {
            courseId: course_Id,
            learnerId: learner_Id,
            rating,
            comment,
        };
        const createdData = await this._reviewRepository.creeateReview(reviewData);
        if (!createdData) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.INTERNAL_SERVER_ERROR, error_message_const_1.HttpResponse.FAILED_TO_CREATE_REVIE);
        }
        const getPopulatedREview = await this._reviewRepository.getReview(createdData._id);
        if (!getPopulatedREview) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.ITEM_NOT_FOUND);
        }
        return (0, review_dto_1.popularedReviewDTO)({
            ...getPopulatedREview.toObject(),
            learnerId: getPopulatedREview.learnerId,
            replies: getPopulatedREview.replies
                ? { mentor: getPopulatedREview.replies.mentorId }
                : null,
        });
    }
    async getCourseReview(courseId) {
        const course_Id = (0, objectId_1.parseObjectId)(courseId);
        if (!course_Id) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.INVALID_ID);
        }
        const reviewdata = await this._reviewRepository.getCourseReview(course_Id);
        if (!reviewdata) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.ITEM_NOT_FOUND);
        }
        return reviewdata.map((review) => (0, review_dto_1.popularedReviewDTO)(review));
    }
}
exports.ReviewService = ReviewService;
