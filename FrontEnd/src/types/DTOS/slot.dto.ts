import type { IBaseSlot, IMentorSlot } from "../slot.types";
import type { ICourseDTO } from "./courses.dto.types";
import type { IMentorDTO } from "./user.dto";

export interface ISlotsDTOS extends IBaseSlot{
  mentorId:string,
  course:{
    _id:string,
    title:string
  }
}

export interface ISlotDTO extends ISlotsDTOS {
  _id: string;
}

export interface ISlotPopulatedDTO extends IBaseSlot {
  _id: string;
  mentor: IMentorDTO;
  course: Pick<ICourseDTO, "_id" | "title">;
}

export const dayMap: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};
