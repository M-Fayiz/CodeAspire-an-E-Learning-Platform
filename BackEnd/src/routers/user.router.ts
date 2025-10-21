import express from "express";
const userRouter = express.Router();
import { UserController } from "../controllers/implementation/UserController";
import { UserRepository } from "../repository/implementation/UserRepository";
import { UserService } from "../services/implementation/UserService";
import { verifyUser } from "../middlewares/authentication.middleware";
import { MentorRepository } from "../repository/implementation/MentorRepository";
import { NotificationRepository } from "../repository/implementation/NotificationRepository";

const userRepository = new UserRepository();
const mentorRepository = new MentorRepository();
const notificationRepository = new NotificationRepository();
const userService = new UserService(
  userRepository,
  mentorRepository,
  notificationRepository,
);
const userController = new UserController(userService);

userRouter.use(verifyUser);

userRouter.get("/me/:id", userController.fetchProfile);
userRouter.patch("/:id/change-password", userController.changePassword);
userRouter.put("/:id/profile-picture", userController.updateProfileImage);
userRouter.put("/me/:id", userController.updateUserProfile);
userRouter.put("/:mentorId/mentor-profile", userController.addMentorData);
userRouter.get("/:id/profile", userController.getUserProfile);

export default userRouter;
