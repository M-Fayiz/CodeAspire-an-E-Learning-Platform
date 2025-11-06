import { Types } from "mongoose";
import { ISlotModel } from "../../models/slot.model";
import { IMentorSlot } from "../slot.type";


export interface ISlotDTO extends IMentorSlot{
    _id:Types.ObjectId
}