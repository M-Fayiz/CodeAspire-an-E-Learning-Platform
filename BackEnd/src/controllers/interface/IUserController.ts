import { promises } from "dns";
import { Request,Response,NextFunction } from "express";


export interface IUserController{
    fetchProfile(req:Request,res:Response,next:NextFunction):Promise<void>
    changePassword(req:Request,res:Response,next:NextFunction):Promise<void>
    preSignedURL(req:Request,res:Response,next:NextFunction):Promise<void>
    get_preSignedURL(req:Request,res:Response,next:NextFunction):Promise<void>
    updateProfileImage(req:Request,res:Response,next:NextFunction):Promise<void>
    updateUserProfile(req:Request,res:Response,next:NextFunction):Promise<void>
}