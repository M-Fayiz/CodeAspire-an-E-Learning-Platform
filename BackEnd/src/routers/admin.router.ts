import express from "express";
const adminRouter = express.Router();

import { UserRepository } from "../repository/implementation/UserRepository";
import { AdminService } from "../services/implementation/AdminService";
import { AdminController } from "../controllers/implementation/AdminController";
import { verifyUser } from "../middlewares/authentication.middleware";
import { authorizedRole } from "../middlewares/authorisation.middleware";
import { IRole } from "../types/user.types";


const userRepository = new UserRepository();
const adminService = new AdminService(userRepository);
const adminController = new AdminController(adminService);

adminRouter.use(verifyUser);
adminRouter.use(authorizedRole(IRole.Admin));

adminRouter.get("/users", adminController.fetchAllUsers);
adminRouter.delete("/users/:id/block", adminController.blockUser);
adminRouter.get("/users/:id", adminController.userProfile);
adminRouter.put("/users/:id/approve", adminController.approveMentor);
// adminRouter.get('/dashboard')

export default adminRouter;
