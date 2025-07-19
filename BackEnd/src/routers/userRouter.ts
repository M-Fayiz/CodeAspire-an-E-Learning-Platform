import express from "express";
const userRouter=express.Router()
import { UserController } from "../controllers/implementation/userController";
import { UserRepository } from "../repository/implementation/userRepo";
import { UserService } from "../services/implementation/userService";
import { verifyUser } from "../middlewares/authentication.middleware";
import { MentorRepository } from "../repository/implementation/mentorRepository";

const userRepository=new UserRepository()
const mentorRepository=new MentorRepository()
const userService=new UserService(userRepository,mentorRepository)
const userController=new UserController(userService)

userRouter.get('/me',verifyUser,userController.fetchProfile)
userRouter.patch('/:id/change-password',verifyUser,userController.changePassword)
userRouter.get('/s3-presigned-url',verifyUser,userController.preSignedURL)
userRouter.get('/s3-getPresigned-url',verifyUser,userController.get_preSignedURL)
userRouter.put('/:id/profile-picture',verifyUser,userController.updateProfileImage)
userRouter.put('/me/:id',verifyUser,userController.updateUserProfile)




export default userRouter