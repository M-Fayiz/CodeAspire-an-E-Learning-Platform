import { Request, Response, NextFunction } from "express";
import { ISlotService } from "../../services/interface/ISlotService";
import { ISlotController } from "../interface/ISlotController";
import { HttpStatus } from "../../const/http-status";
import { successResponse } from "../../utils/response.util";
import { HttpResponse } from "../../const/error-message";

export class SlotController implements ISlotController{

    constructor(private _slotService:ISlotService){}

    createSlot=async (req: Request, res: Response, next: NextFunction): Promise<void>=> {
        try {
          
            const createdData=await this._slotService.createSlot(req.body)
            res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK,{createdData}))
        } catch (error) {
            next(error)
        }
    }

    getMentorSlots=async(req: Request, res: Response, next: NextFunction): Promise<void>=> {
        try {
            const{mentorId}=req.params
            console.log(mentorId)
            const mentorSlots=await this._slotService.getMontorSlots(mentorId)
            res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK,{mentorSlots}))
        } catch (error) {
             next(error)
        }
    }

}