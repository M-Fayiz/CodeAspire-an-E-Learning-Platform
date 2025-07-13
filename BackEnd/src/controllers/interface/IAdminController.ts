import { Request,Response,NextFunction } from "express";
import { IUserModel } from "../../Models/userModel";

export interface IAdminController{
    fetchAllUsers(req:Request,res:Response,next:NextFunction):Promise<void>
    blockUser(req:Request,res:Response,next:NextFunction):Promise<void>
    userProfile(req:Request,res:Response,next:NextFunction):Promise<void>
}