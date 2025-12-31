"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const http_status_const_1 = require("../../const/http-status.const");
const error_message_const_1 = require("../../const/error-message.const");
const response_util_1 = require("../../utils/response.util");
class ReviewController {
    constructor(_reviewService) {
        this._reviewService = _reviewService;
        this.createReview = async (req, res, next) => {
            try {
                const { courseId, learnerId, comment, rating } = req.body;
                console.warn(req.body);
                const ceratedReview = await this._reviewService.createReview(courseId, learnerId, comment, rating);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { ceratedReview }));
            }
            catch (error) {
                next(error);
            }
        };
        this.getCourseReview = async (req, res, next) => {
            try {
                const { courseId } = req.params;
                const courseReview = await this._reviewService.getCourseReview(courseId);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { courseReview }));
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.ReviewController = ReviewController;
