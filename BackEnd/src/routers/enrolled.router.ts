import express from "express";
const enrolledRouter = express.Router();

import { CourseRepository } from "../repository/implementation/CourseRepository";
import { EnrolledRepository } from "../repository/implementation/EnrolledRepository";
import { EnrolledService } from "../services/implementation/EnrolledService";
import { EnrolledController } from "../controllers/implementation/EnrolledController";
import { verifyUser } from "../middlewares/authentication.middleware";
import { authorizedRole } from "../middlewares/authorisation.middleware";
import { TransactionRepositoy } from "../repository/implementation/TransactionRepository";
import { IRole } from "../types/user.types";
import { UserRepository } from "../repository/implementation/UserRepository";
const transactionRepository = new TransactionRepositoy();
const enrolledRepository = new EnrolledRepository();
const courseRepository = new CourseRepository();
const userRepository = new UserRepository();
const enrolledService = new EnrolledService(
  enrolledRepository,
  courseRepository,
  transactionRepository,
  userRepository,
);
const enrolledController = new EnrolledController(enrolledService);

enrolledRouter.get(
  "/:learnerId",
  verifyUser,
  authorizedRole(IRole.Learner),
  enrolledController.getEnrolledCourse,
);
enrolledRouter.get(
  "/course/:enrolledId",
  verifyUser,
  authorizedRole(IRole.Learner),
  enrolledController.getEnrolledDetails,
);
enrolledRouter.get(
  "/course/:courseId/chart",
  verifyUser,
  authorizedRole(IRole.Mentor),
  enrolledController.getGraphOFCourse,
);
enrolledRouter.get(
  "/course/:courseId/mentor/:mentorId",
  verifyUser,
  authorizedRole(IRole.Mentor),
  enrolledController.getCourseDashboardData,
);
enrolledRouter.get(
  "/mentor/:mentorId/dashboard",
  verifyUser,
  authorizedRole(IRole.Mentor),
  enrolledController.getMentorDashboardData,
);
enrolledRouter.get(
  "/mentor/dashboard/revanue",
  verifyUser,
  authorizedRole(IRole.Mentor),
  enrolledController.getmentorRevanue,
);
enrolledRouter.get(
  "/admin/dashboard/revanue",
  verifyUser,
  authorizedRole(IRole.Admin),
  enrolledController.getAdminRevanue,
);

enrolledRouter.put(
  "/:enrolledId",
  verifyUser,
  authorizedRole(IRole.Learner),
  enrolledController.updateProgress,
);
enrolledRouter.put(
  "/:enrolledId/rating",
  verifyUser,
  authorizedRole(IRole.Learner),
  enrolledController.addRating,
);

export default enrolledRouter;
