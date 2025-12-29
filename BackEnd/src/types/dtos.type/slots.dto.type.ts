import { Types } from "mongoose";
import { IBaseSlot, ISlotsDTOS } from "../slot.type";
import { IMentorDTO } from "./user.dto.types";
import { ICourseDTO } from "./course.dtos.type";
import { ICourses } from "../courses.type";

export interface ISlotDTO extends ISlotsDTOS {
  _id: Types.ObjectId;
}

export interface ISlotpopultedDataFromDB extends IBaseSlot {
  _id: Types.ObjectId;
  mentorId: IMentorDTO;
  courseId: Pick<ICourseDTO, "_id" | "title">;
}

export interface ISlotPopulatedDTO extends IBaseSlot {
  _id: Types.ObjectId;
  mentor: IMentorDTO;
  course: Pick<ICourseDTO, "_id" | "title">;
}

export interface mentorUnPopulatedSlots extends IBaseSlot {
  _id: Types.ObjectId;
  mentorId: Types.ObjectId;
  course: ICourses;
}

export interface mentorPopulatedSlots extends IBaseSlot {
  _id: Types.ObjectId;
  mentorId: Types.ObjectId;
  courseId: {
    _id: Types.ObjectId;
    title: string;
  };
}
