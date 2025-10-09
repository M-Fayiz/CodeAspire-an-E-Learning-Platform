import express from "express";
const notifyRouter = express.Router();

import { NotificationRepository } from "../repository/implementation/NotificationRepository";
import { NotificationService } from "../services/implementation/NotificationService";
import { NotificationController } from "../controllers/implementation/NotificationController";
import { verifyUser } from "../middlewares/authentication.middleware";
import { authorizedRole } from "../middlewares/authorisation.middleware";
import { IRole } from "../types/user.types";

const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);
const notificationController = new NotificationController(notificationService);

notifyRouter.use(verifyUser);
notifyRouter.use(authorizedRole(IRole.Admin, IRole.Learner, IRole.Mentor));

notifyRouter.get("/:userId", notificationController.getAllNotification);
notifyRouter.put("/:notifyId", notificationController.readNotification);

export default notifyRouter;
