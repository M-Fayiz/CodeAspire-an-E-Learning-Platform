import { Types } from "mongoose";
import { ISlotModel } from "../../models/slot.model";


export interface ISlotRepository {
    createSlot(slotData: Partial<ISlotModel>): Promise<ISlotModel>;
    getMentorSLots(mentorId:Types.ObjectId):Promise<ISlotModel[]|null>
}
