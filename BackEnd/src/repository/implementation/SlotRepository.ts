import { Types } from "mongoose";
import { ISlotModel, SlotModel } from "../../models/slot.model";
import { BaseRepository } from "../baseRepository";
import { ISlotRepository } from "../interface/ISlotRepository";

export class SlotRepository extends BaseRepository<ISlotModel> implements ISlotRepository{

    constructor(){
        super(SlotModel)
    }

    async createSlot(slotData: Partial<ISlotModel>): Promise<ISlotModel> {
        return await this.create(slotData)
    }
    async getMentorSLots(mentorId: Types.ObjectId): Promise<ISlotModel[]|null> {
        return await this.find({mentorId:mentorId})
    }
}