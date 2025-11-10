import express from "express";
const adminRouter = express.Router();

import { UserRepository } from "../repository/implementation/UserRepository";
import { AdminService } from "../services/implementation/AdminService";
import { AdminController } from "../controllers/implementation/AdminController";
import { verifyUser } from "../middlewares/authentication.middleware";
import { authorizedRole } from "../middlewares/authorisation.middleware";
import { IRole } from "../types/user.types";
import { NotificationRepository } from "../repository/implementation/NotificationRepository";
import { CourseRepository } from "../repository/implementation/CourseRepository";
import { TransactionRepositoy } from "../repository/implementation/TransactionRepository";
import { EnrolledRepository } from "../repository/implementation/EnrolledRepository";

const userRepository = new UserRepository();
const notificationRespository = new NotificationRepository();
const courseRepository = new CourseRepository();
const transactionRepository = new TransactionRepositoy();
const enrolledRepository = new EnrolledRepository();
const adminService = new AdminService(
  userRepository,
  notificationRespository,
  courseRepository,
  transactionRepository,
  enrolledRepository,
);
const adminController = new AdminController(adminService);

adminRouter.use(verifyUser);
adminRouter.use(authorizedRole(IRole.Admin));

adminRouter.get("/users", adminController.fetchAllUsers);
adminRouter.delete("/users/:userId/block", adminController.blockUser);
adminRouter.get("/users/:userId", adminController.userProfile);
adminRouter.put("/users/:userId/approve", adminController.approveMentor);
adminRouter.get("/dashboard/cards", adminController.getDashboardCardData);

export default adminRouter;
