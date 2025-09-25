import express from "express";
const reviewRouter = express.Router();
import { ReviewController } from "../controllers/implementation/ReviewController";
import { ReviewService } from "../services/implementation/ReviewService";
import { ReviewRepository } from "../repository/implementation/ReviewRepository";

const reviewRepository = new ReviewRepository();
const reviewService = new ReviewService(reviewRepository);
const reviewController = new ReviewController(reviewService);

reviewRouter.post("/", reviewController.createReview);
reviewRouter.get("/:courseId", reviewController.getCourseReview);
export default reviewRouter;
