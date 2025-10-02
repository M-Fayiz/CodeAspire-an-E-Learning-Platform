import express from "express";
const enrolledRouter = express.Router();

import { CourseRepository } from "../repository/implementation/CourseRepository";
import { EnrolledRepository } from "../repository/implementation/EnrolledRepository";
import { EnrolledService } from "../services/implementation/EnrolledService";
import { EnrolledController } from "../controllers/implementation/EnrolledController";
import { verifyUser } from "../middlewares/authentication.middleware";
import { authorizedRole } from "../middlewares/authorisation.middleware";
import { TransactionRepositoy } from "../repository/implementation/TransactionRepository";
const transactionRepository = new TransactionRepositoy();
const enrolledRepository = new EnrolledRepository();
const courseRepository = new CourseRepository();
const enrolledService = new EnrolledService(
  enrolledRepository,
  courseRepository,
  transactionRepository,
);
const enrolledController = new EnrolledController(enrolledService);

enrolledRouter.get(
  "/:learnerId",
  verifyUser,
  authorizedRole("learner"),
  enrolledController.getEnrolledCourse,
);
enrolledRouter.get(
  "/course/:enrolledId",
  verifyUser,
  authorizedRole("learner"),
  enrolledController.getEnrolledDetails,
);
enrolledRouter.get(
  "/course/:courseId/chart",
  verifyUser,
  authorizedRole("mentor"),
  enrolledController.getGraphOFCourse,
);
enrolledRouter.get(
  "/course/:courseId/mentor/:mentorId",
  verifyUser,
  authorizedRole("mentor"),
  enrolledController.getCourseDashboardData,
);
enrolledRouter.put(
  "/:enrolledId",
  verifyUser,
  authorizedRole("learner"),
  enrolledController.updateProgress,
);
enrolledRouter.put(
  "/:enrolledId/rating",
  verifyUser,
  authorizedRole("learner"),
  enrolledController.addRating,
);

export default enrolledRouter;
