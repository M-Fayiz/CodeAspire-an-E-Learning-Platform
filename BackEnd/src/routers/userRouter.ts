import express from "express";
const userRouter=express.Router()
import { UserController } from "../controllers/implementation/userController";
import { UserRepository } from "../repository/implementation/userRepo";
import { UserService } from "../services/implementation/userService";
import { verifyUser } from "../middlewares/userVerify.middleware";

const userRepository=new UserRepository()
const userService=new UserService(userRepository)
const userController=new UserController(userService)

userRouter.get('/profile',verifyUser,userController.fetchProfile)
userRouter.patch('/change-password/:id',userController.changePassword)
userRouter.get('/s3-presigned-url',userController.preSignedURL)
userRouter.get('/s3-getPresigned-url',userController.get_preSignedURL)
userRouter.put('/profile-picture/:id',userController.updateProfileImage)
userRouter.put('/profile/:id',userController.updateUserProfile)




export default userRouter