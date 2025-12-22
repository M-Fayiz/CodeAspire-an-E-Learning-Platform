import express from "express";
const userRouter = express.Router();
import { UserController } from "../controllers/implementation/UserController";
import { UserRepository } from "../repository/implementation/UserRepository";
import { UserService } from "../services/implementation/userService";
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

userRouter.get("/me/:userId", userController.fetchProfile);
userRouter.patch("/:userId/change-password", userController.changePassword);
userRouter.put("/:userId/profile-picture", userController.updateProfileImage);
userRouter.put("/me/:userId", userController.updateUserProfile);
userRouter.put("/:mentorId/mentor-profile", userController.addMentorData);
userRouter.get("/:userId/profile", userController.getUserProfile);

export default userRouter;
