import { Request,response,NextFunction } from "express";
import { User } from "../Models/userModel";
import { createHttpError } from "../utility/http-error";
import { HttpStatus } from "../const/http-status";
import { HttpResponse } from "../const/error-message";
import { verifyAccesToken } from "../utility/jwt-token.util";

export async function verifyUser(req:Request,res:Response,next:NextFunction){
    try {
       const {accessToken,refreshToken}=req.cookies

       if(!accessToken&&!refreshToken){
        throw createHttpError(HttpStatus.UNAUTHORIZED,HttpResponse.UNAUTHORIZED)
       }
       const decode=verifyAccesToken(accessToken)
        if(!decode){
            throw createHttpError(HttpStatus.UNAUTHORIZED,HttpResponse.TOKEN_EXPIRED)
        }
       const user=await User.findOne({email:decode.email})
       
       if(!user||!user?.isActive){
             throw createHttpError(HttpStatus.FORBIDDEN, HttpResponse.USER_BLOCKED)
       }
       req.user=user;
       next();
    } catch (error) {
        next(error)
    }

}