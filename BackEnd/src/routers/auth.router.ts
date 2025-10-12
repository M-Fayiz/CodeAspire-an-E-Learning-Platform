import express from "express";
import { Validate } from "../middlewares/validate";
import { IRole } from "../types/user.types";
const authRouter = express.Router();
import { Request, Response, NextFunction } from "express";
import { UserRepository } from "../repository/implementation/UserRepository";
import { AuthService } from "../services/implementation/authService"; 
import { AuthController } from "../controllers/implementation/authController"; 
import { registerSchema } from "../utility/zod";
import passport from "../utility/passport.util";
import { env } from "../config/env.config";

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

authRouter.post(
  "/signup",
  Validate(registerSchema),
  authController.signUp.bind(authController),
);
authRouter.post(
  "/verify-email",
  authController.verifyEmail.bind(authController),
);
authRouter.post("/me", authController.authMe.bind(authController));
authRouter.get(
  "/refresh-token",
  authController.refreshToken.bind(authController),
);
authRouter.post("/login", authController.login.bind(authController));
authRouter.post("/logout", authController.logout.bind(authController));
authRouter.post(
  "/forgot-password",
  authController.forgotPassword.bind(authController),
);
authRouter.patch(
  "/reset-password",
  authController.resetPassword.bind(authController),
);

// Google Auth
authRouter.get(
  "/google",
  (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.query as { role?: IRole };
    req.session.role = role || IRole.Learner;
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  }),
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${env.CLIENT_ORGIN}/auth/login`,
  }),
  authController.googleAuthRedirection.bind(authController),
);

export default authRouter;
