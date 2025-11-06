import { HttpResponse } from "../../const/error-message";
import { HttpStatus } from "../../const/http-status";
import { slotDTO } from "../../dtos/slot.dto";
import { parseObjectId } from "../../mongoose/objectId";
import { ISlotRepository } from "../../repository/interface/ISlotRepository";
import { ISlotDTO } from "../../types/dtos.type/slots.dto.type";
import { IMentorSlot } from "../../types/slot.type";
import { createHttpError } from "../../utils/http-error";
import { ISlotService } from "../interface/ISlotService";

export class SlotService implements ISlotService {

    constructor(private _slotRepository:ISlotRepository){}

    async createSlot(slotData: IMentorSlot): Promise<void> {
        await this._slotRepository.createSlot(slotData)
    }

    async getMontorSlots(mentorId: string): Promise<ISlotDTO[]> {
        const mentor_Id= parseObjectId(mentorId)
        if(!mentor_Id){
            throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.INVALID_ID)
        }
        
        const mentorSlots= await this._slotRepository.getMentorSLots(mentor_Id)
        if(!mentorSlots){
            throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.ITEM_NOT_FOUND)
        }
        console.log('this is the mentor slot :',mentorSlots)
        return  mentorSlots?.map(slot=>slotDTO(slot))    
    }
    
}