import express from "express";
const adminRouter = express.Router();

import { UserRepository } from "../repository/implementation/UserRepository";
import { AdminService } from "../services/implementation/AdminService";
import { AdminController } from "../controllers/implementation/AdminController";
import { verifyUser } from "../middlewares/authentication.middleware";
import { authorizedRole } from "../middlewares/authorisation.middleware";
import { IRole } from "../types/user.types";
import { NotificationRepository } from "../repository/implementation/NotificationRepository";

const userRepository = new UserRepository();
const notificationRespository = new NotificationRepository();
const adminService = new AdminService(userRepository, notificationRespository);
const adminController = new AdminController(adminService);

adminRouter.use(verifyUser);
adminRouter.use(authorizedRole(IRole.Admin));

adminRouter.get("/users", adminController.fetchAllUsers);
adminRouter.delete("/users/:userId/block", adminController.blockUser);
adminRouter.get("/users/:userId", adminController.userProfile);
adminRouter.put("/users/:userId/approve", adminController.approveMentor);
// adminRouter.get('/dashboard')

export default adminRouter;
