import { Response,Request,NextFunction, response } from "express";
import { IAuthController } from "../interface/IAuthController";
import { IAuthService } from "../../services/interface/IauthService";
import { HttpStatus } from "../../const/http-status";
import { HttpResponse } from "../../const/error-message";
import { successResponse } from "../../utility/response.util";
import {options} from '../../config/cookie.config'
import { createHttpError } from "../../utility/http-error";
import { clearCookies } from "../../utility/clearCookies.util";
import { setAccessToken,setRefreshToken } from "../../utility/cookie.util";
import { IUserModel } from "../../Models/userModel";
import { env } from "../../config/env.config";



export class AuthController implements IAuthController{

    constructor(private _authSerive:IAuthService){}

  async signUp (req: Request, res: Response,next:NextFunction): Promise<void>{
        try {
         
          const email= await this._authSerive.signUp(req.body)

          res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK,{email:email}))

        } catch (error) {
      
          next(error)
        }
  }
  async verifyEmail(req:Request,res:Response,next:NextFunction):Promise<void>{
          try {
              console.log('verify Email')
             const token=await this._authSerive.verifyEmail(req.body)
             setAccessToken(res,token.accessToken)
             setRefreshToken(res,token.refreshToken,) 
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
            return next(createHttpError(HttpStatus.UNAUTHORIZED,HttpResponse.ACCESS_TOKEN_EXPIRED))
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
          throw createHttpError(HttpStatus.FORBIDDEN,HttpResponse.REFRESH_TOKEN_EXPIRED)
        }

        const {newAccessToken,payload}=await this._authSerive.refreshAccessToken(refreshToken)
         res.cookie('accessToken',newAccessToken,{...options, maxAge: 15 * 60 * 1000})
         res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK,{user:payload}))
       } catch (error) {
        next(error)
       }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
       try {
     
       const {email,password}=req.body
       const tokens=await this._authSerive.login(email,password)
        setAccessToken(res,tokens.accessToken)
        setRefreshToken(res,tokens.refreshToken) 

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
        const email=await this._authSerive.forgotPassword(req.body.email)

        res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK,{email:email}))
      } catch (error) {
        next(error)
      } 
  }
  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log(req.body)
       try {
        const {email,token,password}=req.body
        const response=await this._authSerive.resetPassword(email,token,password)
        res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK,{email:response}))
       } catch (error) {
        next(error)
       }
  }
  async googleAuthRedirection(req: Request, res: Response, next: NextFunction): Promise<void> {
       try {
        if(!req.user){
          res.status(HttpStatus.FORBIDDEN).json(HttpResponse.INVALID_CREDNTIALS)
          return
        }
        console.log('google user data',req.user)
        const userData:{id:string,email:string,role:string}=req.user as { id: string; email: string; role: string };
        const Data=await this._authSerive.generateToken(req.user as IUserModel)
    
        setAccessToken(res,Data.accessToken)
        setRefreshToken(res,Data.refreshToken)
        res.redirect(`${env.CLIENT_ORGIN}`)
       } catch (error) {
          res.redirect(`${env.CLIENT_ORGIN}/auth/signup`)
       }
  }
}




