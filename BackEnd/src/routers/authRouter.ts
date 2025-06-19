import express from "express";
import { Validate } from "../middlewares/validate";
const authRouter=express.Router()

import { UserRepository } from "../repository/implementation/userRepo";
import { AuthService } from "../services/implementation/authService";
import { AuthController } from "../controllers/implementation/authController";
import { registerSchema } from "../utility/zod";


const userRepository=new UserRepository()
const authService=new AuthService(userRepository)
const authController=new AuthController(authService)

authRouter.post('/signup',Validate(registerSchema),authController.signUp.bind(authController))
authRouter.post('/verifyEmail',authController.verifyEmail.bind(authController))
authRouter.post('/me',authController.authMe.bind(authController))
authRouter.post('/refreshToken',authController.refreshToken.bind(authController))
authRouter.post('/login',authController.login.bind(authController))
export default authRouter