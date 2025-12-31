import { Types } from "mongoose";
import { ILearnerModel } from "../../models/user.model";
import { ILearnerStreask } from "../../types/user.types";


export interface ILearnerRepository{
    updateLearningStreak(
    learnerId: Types.ObjectId,
    streak: ILearnerStreask,
    activeDate:Date
  ) :Promise<ILearnerModel|null>
  getLearnerStreak(learnerId:Types.ObjectId):Promise<ILearnerModel|null>
}