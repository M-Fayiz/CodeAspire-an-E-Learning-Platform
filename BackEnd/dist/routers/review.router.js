"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reviewRouter = express_1.default.Router();
const ReviewController_1 = require("../controllers/implementation/ReviewController");
const ReviewService_1 = require("../services/implementation/ReviewService");
const ReviewRepository_1 = require("../repository/implementation/ReviewRepository");
const reviewRepository = new ReviewRepository_1.ReviewRepository();
const reviewService = new ReviewService_1.ReviewService(reviewRepository);
const reviewController = new ReviewController_1.ReviewController(reviewService);
reviewRouter.post("/", reviewController.createReview);
reviewRouter.get("/:courseId", reviewController.getCourseReview);
exports.default = reviewRouter;
