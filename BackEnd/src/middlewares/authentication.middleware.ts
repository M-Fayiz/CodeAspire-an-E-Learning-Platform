import { Request,Response,NextFunction } from "express";
import { UserModel } from "../Models/userModel";
import { createHttpError } from "../utility/http-error";
import { HttpStatus } from "../const/http-status";
import { HttpResponse } from "../const/error-message";
import { verifyAccesToken } from "../utility/jwt-token.util";

export async function verifyUser(req:Request,res:Response,next:NextFunction){
    try {
       const {accessToken,refreshToken}=req.cookies

       if(!accessToken){
        throw createHttpError(HttpStatus.UNAUTHORIZED,HttpResponse.UNAUTHORIZED)
       }
       console.log(1)
       const decode=verifyAccesToken(accessToken)
       if(!decode){
            console.log(2)
            throw createHttpError(HttpStatus.UNAUTHORIZED,HttpResponse.ACCESS_TOKEN_EXPIRED)
        }
       const user=await UserModel.findOne({email:decode.email})
       
       if(!user||!user?.isActive){
            throw createHttpError(HttpStatus.FORBIDDEN, HttpResponse.USER_BLOCKED)
        }
       req.user=user;
       next();
    } catch (error) {
        next(error)
    }

}