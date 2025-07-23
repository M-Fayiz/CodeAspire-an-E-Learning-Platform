import { NextFunction, Request,Response } from "express";


export interface ICategoryController{
    createCategory(req:Request,res:Response,next:NextFunction):Promise<void>
    listCategories(req:Request,res:Response,next:NextFunction):Promise<void>
}