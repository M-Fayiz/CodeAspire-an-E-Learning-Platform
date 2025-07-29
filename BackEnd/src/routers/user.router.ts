import express from "express";
const userRouter=express.Router()
import { UserController } from "../controllers/implementation/UserController";
import { UserRepository } from "../repository/implementation/UserRepository";
import { UserService } from "../services/implementation/UserService";
import { verifyUser } from "../middlewares/authentication.middleware";
import { MentorRepository } from "../repository/implementation/MentorRepository";

const userRepository=new UserRepository()
const mentorRepository=new MentorRepository()
const userService=new UserService(userRepository,mentorRepository)
const userController=new UserController(userService)

userRouter.use(verifyUser)
userRouter.get('/me',userController.fetchProfile)
userRouter.patch('/:id/change-password',userController.changePassword)
userRouter.get('/s3-presigned-url',userController.preSignedURL)
userRouter.get('/s3-getPresigned-url',userController.get_preSignedURL)
userRouter.put('/:id/profile-picture',userController.updateProfileImage)
userRouter.put('/me/:id',userController.updateUserProfile)
userRouter.put('/:id/mentor-profile',userController.updateUserProfile)




export default userRouter