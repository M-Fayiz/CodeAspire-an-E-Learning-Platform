import { Response,Request,NextFunction } from "express";
import { IAuthController } from "../interface/authController";
import { IAuthService } from "../../services/interface/IauthService";
import { HttpStatus } from "../../const/http-status";
import { HttpResponse } from "../../const/error-message";
import { successResponse } from "../../utility/response.util";
import {options} from '../../config/cookie.config'
import { createHttpError } from "../../utility/http-error";
import { clearCookies } from "../../utility/clearCookies.util";
import { token } from "morgan";
import { date } from "zod";



export class AuthController implements IAuthController{

    constructor(private _authSerive:IAuthService){}

   async signUp (req: Request, res: Response,next:NextFunction): Promise<void>{
        try {
         
            const email= await this._authSerive.signUp(req.body)

            res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK,{email:email}))

        } catch (error) {
          console.log('error from registeration ',error)
           next(error)
        }
    }
   async verifyEmail(req:Request,res:Response,next:NextFunction):Promise<void>{
           try {
              console.log('verify Email')
             const token=await this._authSerive.verifyEmail(req.body)
            res.cookie('accessToken',token.accessToken,{...options, maxAge: 15* 60 * 1000})
            res.cookie('refreshToken',token.refreshToken,{...options, maxAge:  7*24*60* 60 * 1000})
            console.log('😎 token from verify ',token)
             res.status(HttpStatus.OK).json(successResponse(HttpResponse.LOGGED_IN_SUCCESSFULLY,{token:token}))
           } catch (error) {
            next()
           }
    }

   async authMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {accessToken}=req.cookies
      console.log('authme cntrl-access✅',accessToken)
           if(!accessToken){
            return
           }
          const user=await this._authSerive.authMe(accessToken)

          res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK,{user:user}))
    } catch (error) {
      next(error)
    }      
   }

   async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
       try {
        const {refreshToken}=req.cookies

        if(!refreshToken){
          throw createHttpError(HttpStatus.UNAUTHORIZED,HttpResponse.UNAUTHORIZED)
        }

        const {newAccessToken,payload}=await this._authSerive.refreshAccessToken(refreshToken)
         res.cookie('accesstoken',newAccessToken,{...options, maxAge: 15 * 60 * 1000})
         res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK,{user:payload}))
       } catch (error) {
        next(error)
       }
   }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
       try {
       console.log('✅ this is body from login',req.body)
       const {email,password}=req.body
       const tokens=await this._authSerive.login(email,password)
       res.cookie('accessToken',tokens.accessToken,{...options, maxAge: 15 * 60 * 1000})
       res.cookie('refreshToken',tokens.refreshToken,{...options, maxAge:  7 * 24 * 60 * 60 * 1000})
       console.log(tokens)
       res.status(HttpStatus.OK).json(successResponse(HttpResponse.LOGGED_IN_SUCCESSFULLY,tokens.payload))
       } catch (error) {
        next(error)
       }
   }

   async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        clearCookies(res)
        res.status(HttpStatus.OK).json(successResponse(HttpResponse.LOGGED_OUT))
      } catch (error) {
        next(error)
      }
   }
   async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        console.log(req.body)
      } catch (error) {
        
      } 
   }
}




