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
import { CertificateRepository } from "../repository/implementation/CertificateRepository";
import { SlotBookingRepository } from "../repository/implementation/SlotBookingRepositoy";
import { LearnerRepository } from "../repository/implementation/LearnerRepository";
const transactionRepository = new TransactionRepositoy();
const enrolledRepository = new EnrolledRepository();
const courseRepository = new CourseRepository();
const userRepository = new UserRepository();
const certificateRepository = new CertificateRepository();
const slotBookingRepository = new SlotBookingRepository();
const learnerRepository = new LearnerRepository();
const enrolledService = new EnrolledService(
  enrolledRepository,
  courseRepository,
  transactionRepository,
  userRepository,
  certificateRepository,
  slotBookingRepository,
  learnerRepository,
);
const enrolledController = new EnrolledController(enrolledService);

enrolledRouter.get(
  "/",
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
  "/course/:courseId/mentor/",
  verifyUser,
  authorizedRole(IRole.Mentor),
  enrolledController.getCourseDashboardData,
);
enrolledRouter.get(
  "/mentor/dashboard",
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
enrolledRouter.get(
  "/learner/dashboard",
  verifyUser,
  authorizedRole(IRole.Learner),
  enrolledController.getLearnerDashboardData,
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
