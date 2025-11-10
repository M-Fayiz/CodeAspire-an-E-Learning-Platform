import type { IBaseSlot, IMentorSlot, slotDays } from "../slot.types";
import type { ICourseDTO } from "./courses.dto.types";
import type { IMentorDTO } from "./user.dto";

export interface ISlotDTO extends IMentorSlot{
    _id:string
}


export interface ISlotPopulatedDTO extends IBaseSlot {
  _id: string;
  mentor: IMentorDTO;
  course: Pick<ICourseDTO, "_id" | "title">;
}

export const dayMap: Record<number, slotDays> = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};