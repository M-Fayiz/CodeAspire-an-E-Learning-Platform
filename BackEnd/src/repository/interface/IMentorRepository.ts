import { NextFunction,Request,Response } from "express";
import { Types } from "mongoose";
import { IMenterModel } from "../../Models/userModel";


export interface IMentorRepository{
    updateMentorProfile(id:Types.ObjectId,update:Partial<IMenterModel>):Promise<IMenterModel|null>
}