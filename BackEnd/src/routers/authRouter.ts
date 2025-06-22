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
authRouter.post('/verify-email',authController.verifyEmail.bind(authController))
authRouter.post('/me',authController.authMe.bind(authController))
authRouter.post('/refresh-token',authController.refreshToken.bind(authController))
authRouter.post('/login',authController.login.bind(authController))
authRouter.post('/logout',authController.logout.bind(authController))
authRouter.post('/forgot-password',authController.forgotPassword.bind(authController))
export default authRouter