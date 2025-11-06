import { NextFunction, Request, Response } from "express";

export  interface ISlotController{
    createSlot(req:Request,res:Response,next:NextFunction):Promise<void>
    getMentorSlots(req:Request,res:Response,next:NextFunction):Promise<void>
}