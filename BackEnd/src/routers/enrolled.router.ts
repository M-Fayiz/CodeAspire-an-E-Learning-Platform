import express from "express";
const enrolledRouter = express.Router();

import { CourseRepository } from "../repository/implementation/CourseRepository";
import { EnrolledRepository } from "../repository/implementation/EnrolledRepository";
import { EnrolledService } from "../services/implementation/EnrolledService";
import { EnrolledController } from "../controllers/implementation/EnrolledController";
import { verifyUser } from "../middlewares/authentication.middleware";
import { authorizedRole } from "../middlewares/authorisation.middleware";
const enrolledRepository = new EnrolledRepository();
const courseRepository = new CourseRepository();
const enrolledService = new EnrolledService(
  enrolledRepository,
  courseRepository,
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
enrolledRouter.put(
  "/:enrolledId",
  verifyUser,
  authorizedRole("learner"),
  enrolledController.updateProgress,
);

export default enrolledRouter;
