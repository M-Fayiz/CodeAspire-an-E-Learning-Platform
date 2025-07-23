import { NextFunction,Request,Response } from "express";
import { Types } from "mongoose";
import { IMenterModel } from "../../models/user.model";


export interface IMentorRepository{
    updateMentorProfile(id:Types.ObjectId,update:Partial<IMenterModel>):Promise<IMenterModel|null>
}