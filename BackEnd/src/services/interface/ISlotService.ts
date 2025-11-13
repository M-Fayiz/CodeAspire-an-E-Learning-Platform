import { ISlotModel } from "../../models/slot.model";
import {
  ISlotDTO,
  ISlotPopulatedDTO,
  mentorPopulatedSlots,
} from "../../types/dtos.type/slots.dto.type";
import { IMentorSlot } from "../../types/slot.type";

export interface ISlotService {
  createSlot(slotData: IMentorSlot): Promise<ISlotDTO>;
  getMontorSlots(mentorId: string): Promise<ISlotDTO[]>;
  updateSlot(slotId: string, slotData: ISlotModel): Promise<ISlotDTO>;
  getCourseSlot(courseId: string): Promise<ISlotPopulatedDTO>;
}
