import { NextFunction, Request,Response } from "express";



export interface ICourseCategory{
    addCourse(req:Request,res:Response,next:NextFunction):Promise<void>
    updateCourse(req:Request,res:Response,next:NextFunction):Promise<void>
}