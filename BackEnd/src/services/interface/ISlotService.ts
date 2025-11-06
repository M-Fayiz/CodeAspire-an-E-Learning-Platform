import { ISlotDTO } from "../../types/dtos.type/slots.dto.type";
import { IMentorSlot } from "../../types/slot.type";

export interface ISlotService{
    createSlot(slotData:IMentorSlot):Promise<void>
    getMontorSlots(mentorId:string):Promise<ISlotDTO[]>
}