import { IEnrolledRepository } from "../interface/IEnrolledRepositoy";
import { BaseRepository } from "../baseRepository";
import { EnrolleModel, IEnrolledModel } from "../../models/enrolled.model";
import {
  chartAggregation,
  chartFilter,
  IEnrolledAggregation,
  IEnrollement,
} from "../../types/enrollment.types";
import { Types } from "mongoose";
import {
  IMentorDashboardData,
  ITopCategory,
  ITopCourse,
} from "../../types/mentorDashboard.types";

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
  async getCourseEnrollmentTrend(
    courseId: Types.ObjectId,
    filterChart: chartFilter,
  ): Promise<chartAggregation[]> {
    return await this.aggregate<chartAggregation>([
      {
        $match: {
          courseId: courseId,
          createdAt: {
            $gte: filterChart.start,
            $lte: filterChart.end,
          },
        },
      },
      {
        $group: {
          _id: {
            day: {
              $dateToString: {
                format: "%Y-%m-%dT00:00:00Z",
                date: "$createdAt",
              },
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.day": 1 } },
    ]);
  }
  async getMentorDashboardData(
    mentorId: Types.ObjectId,
  ): Promise<IMentorDashboardData[]> {
    return await this.aggregate<IMentorDashboardData>([
      {
        $match: {
          mentorId: mentorId,
        },
      },
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
  async getTopSellingCourse(mentorId?: Types.ObjectId): Promise<ITopCourse[]> {

    const matchStage = mentorId ? { mentorId } : {};
    return await this.aggregate<ITopCourse>([
      {
        $match: matchStage,
      },
      {
        $group: {
          _id: "$courseId",
          totalStudent: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          totalStudent: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $project: {
          courseId: "$course._id",
          title: "$course.title",
          enrolledStudent: "$totalStudent",
        },
      },
    ]);
  }
  async getTopSellingCategory(
    mentorId?: Types.ObjectId,
  ): Promise<ITopCategory[]> {
    const matchStage = mentorId ? { mentorId } : {};
    return await this.aggregate<ITopCategory>([
      {
        $match: {
          mentorId: matchStage,
        },
      },
      {
        $group: {
          _id: "$categoryId",
          totalStudent: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          totalStudent: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "Category",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $project: {
          courseId: "$_id",
          title: "$category.title",
          enrolledStudent: "$totalStudent",
        },
      },
    ]);
  }
}
