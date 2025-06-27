import { promises } from "dns";
import { Request,Response,NextFunction } from "express";


export interface IUserController{
    fetchProfile(req:Request,res:Response,next:NextFunction):Promise<void>
    changePassword(req:Request,res:Response,next:NextFunction):Promise<void>
}