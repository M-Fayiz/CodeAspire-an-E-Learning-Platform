import express from "express";
const userRouter=express.Router()
import { UserController } from "../controllers/implementation/userController";
import { UserRepository } from "../repository/implementation/userRepo";
import { UserService } from "../services/implementation/userService";

const userRepository=new UserRepository()
const userService=new UserService(userRepository)
const userController=new UserController(userService)

userRouter.get('/profile',userController.fetchProfile)
userRouter.patch('/change-password/:id',userController.changePassword)




export default userRouter