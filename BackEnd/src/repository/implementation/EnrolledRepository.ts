import { IEnrolledRepository } from "../interface/IEnrolledRepositoy";
import { BaseRepository } from "../baseRepository";
import { EnrolleModel, IEnrolledModel } from "../../models/enrolled.model";
import {
  IEnrolledAggregation,
  IEnrollement,
} from "../../types/enrollment.types";
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
  async getEnrolledCOurseDetails(
    enrolledId: Types.ObjectId,
  ): Promise<IEnrolledModel | null> {
    return await this.findById(enrolledId);
  }
  async isEnrolled(
    userId: Types.ObjectId,
    courseId: Types.ObjectId,
  ): Promise<IEnrolledModel | null> {
    return await this.findOne({ learnerId: userId, courseId: courseId });
  }
  async updatedProgress(
    enrolledId: Types.ObjectId,
    lecture: Types.ObjectId,
  ): Promise<IEnrolledModel | null> {
    return await this.addTOSet(
      { _id: enrolledId },
      "progress.completedLectures",
      lecture,
    );
  }
  async addRating(
    enrolledId: Types.ObjectId,
    value: number,
  ): Promise<IEnrolledModel | null> {
    return await this.findByIDAndUpdate(enrolledId, { rating: value });
  }
  async getEnrolledDasgboardData(
    courseId: Types.ObjectId,
    mentorId: Types.ObjectId,
  ): Promise<IEnrolledAggregation[] | null> {
    return await this.aggregate<IEnrolledAggregation>([
      { $match: { courseId, mentorId } },
      {
        $group: {
          _id: null,
          avgRating: {
            $avg: "$rating",
          },
          totalStudents: {
            $sum: 1,
          },
        },
      },
    ]);
  }
}
