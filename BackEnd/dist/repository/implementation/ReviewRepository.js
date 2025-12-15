"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRepository = void 0;
const review_model_1 = __importDefault(require("../../models/review.model"));
const baseRepository_1 = require("../baseRepository");
class ReviewRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(review_model_1.default);
    }
    async creeateReview(revieweData) {
        return await this.create(revieweData);
    }
    async getCourseReview(courseId) {
        return await this.find({ courseId: courseId }, [
            "learnerId",
        ]);
    }
    async getReview(reviewId) {
        return await this.findById(reviewId, ["learnerId"]);
    }
}
exports.ReviewRepository = ReviewRepository;
