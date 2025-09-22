import { Types } from "mongoose";
import { IFormCourseDTO } from "./dtos.type/course.dtos.type";


export interface IProgressTrack{
  _id:Types.ObjectId
  title: string;
    lectures: {
      _id:Types.ObjectId,
      title:string
    }[];
    
}

export interface IEnrollement {
  learnerId: Types.ObjectId;
  courseId: Types.ObjectId | IFormCourseDTO;
  mentorId: Types.ObjectId;
  progress: {
    progressTrack: IProgressTrack[];
    lastAccessedLecture: Types.ObjectId | null;
    completionPercentage: number;
  };
  createdAt?: Date;
}
