import { Types, UpdateQuery } from "mongoose";
import { ILearnerModel, LearnerModel } from "../../models/user.model";
import { BaseRepository } from "../baseRepository";
import { ILearnerStreask } from "../../types/user.types";
import { ILearnerRepository } from "../interface/ILearnerRepository";

export class LearnerRepository
  extends BaseRepository<ILearnerModel> implements ILearnerRepository
{
  constructor() {
    super(LearnerModel); 
  }

  async updateLearningStreak(
    learnerId: Types.ObjectId,
    streak: ILearnerStreask,
     activeDate:Date
  ) :Promise<ILearnerModel|null>{
    return await this.findByIDAndUpdate(
      learnerId,
      { 
        $set: { learningStreak: streak } ,
        $addToSet: {
        activeDates: activeDate,
       },
    },
      
      
    );
  }
  async  getLearnerStreak(learnerId: Types.ObjectId): Promise<ILearnerModel|null> {
      return await this.findById(learnerId)
  }
  async updateLearnerProfile(learnerId: Types.ObjectId, updateQuery: UpdateQuery<ILearnerModel>): Promise<ILearnerModel|null> {
    return await this.findByIDAndUpdateProfile(learnerId,updateQuery)
  }
}
