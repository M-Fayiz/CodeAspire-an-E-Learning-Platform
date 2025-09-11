import { IEnrolledRepository } from "../interface/IEnrolledRepositoy";
import { BaseRepository } from "../baseRepository";
import { EnrolleModel, IEnrolledModel } from "../../models/enrolled.model";
import { IEnrollement } from "../../types/enrollment.types";
import { Types } from "mongoose";

export class EnrolledRepository
  extends BaseRepository<IEnrolledModel>
  implements IEnrolledRepository
{
  constructor() {
    super(EnrolleModel);
  }
  async enrolleCourse(
    enrollData: IEnrollement,
  ): Promise<IEnrolledModel | null> {
    return await this.create(enrollData);
  }
  async getEnrolledCourses(
    learnerId: Types.ObjectId,
  ): Promise<IEnrolledModel[] | null> {
    return await this.find({ learnerId: learnerId });
  }
}
