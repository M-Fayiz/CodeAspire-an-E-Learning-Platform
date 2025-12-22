import { ISlotModel } from "../../models/slot.model";
import {
  ISlotDTO,
  ISlotPopulatedDTO,
} from "../../types/dtos.type/slots.dto.type";
import { IMentorSlot } from "../../types/slot.type";

export interface ISlotService {
  createSlot(slotData: IMentorSlot): Promise<ISlotDTO>;
  getMontorSlots(
    mentorId: string,
    page: number,
  ): Promise<{ mappedSlots: ISlotDTO[]; totalDocument: number }>;
  updateSlot(slotId: string, slotData: ISlotModel): Promise<ISlotDTO>;
  getCourseSlot(courseId: string): Promise<ISlotPopulatedDTO>;
}
