import {Request, Response,NextFunction  } from "express"

export interface ISharedController{
    createS3BucketUplaodURL(req:Request,res:Response,next:NextFunction):Promise<void>
}