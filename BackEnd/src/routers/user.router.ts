import express from "express";
const userRouter = express.Router();
import { UserController } from "../controllers/implementation/UserController";
import { UserRepository } from "../repository/implementation/UserRepository";
import { UserService } from "../services/implementation/UserSevice";
import { verifyUser } from "../middlewares/authentication.middleware";
import { MentorRepository } from "../repository/implementation/MentorRepository";
import { NotificationRepository } from "../repository/implementation/NotificationRepository";
import { LearnerRepository } from "../repository/implementation/LearnerRepository";

const userRepository = new UserRepository();
const mentorRepository = new MentorRepository();
const notificationRepository = new NotificationRepository();
const learnerRepository = new LearnerRepository();
const userService = new UserService(
  userRepository,
  mentorRepository,
  notificationRepository,
  learnerRepository,
);
const userController = new UserController(userService);

userRouter.use(verifyUser);

userRouter.get("/me", userController.fetchProfile);
userRouter.patch("/change-password", userController.changePassword);
userRouter.put("/profile-picture", userController.updateProfileImage);
userRouter.put("/me", userController.updateUserProfile);
userRouter.put("/mentor-profile", userController.addMentorData);
userRouter.get("/:userId/profile", userController.getUserProfile);

export default userRouter;
