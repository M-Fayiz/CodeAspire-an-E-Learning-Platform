import { FilterQuery, Types, UpdateQuery } from "mongoose";
import {
  ISlotBookingModel,
  SlotBookingModel,
} from "../../models/sessionBooking.model";
import { ISlotBooking, StudenStatus } from "../../types/sessionBooking.type";
import { BaseRepository } from "../baseRepository";
import { ISlotBookingRepository } from "../interface/ISlotBookingRepository";
import { IPopulatedBooking } from "../../types/dtos.type/slotBooking.dto.type";
import { LearnerSlotCard } from "../../types/learnerDashboard.type";

export class SlotBookingRepository
  extends BaseRepository<ISlotBookingModel>
  implements ISlotBookingRepository
{
  constructor() {
    super(SlotBookingModel);
  }

  async createBooking(
    bookingData: Partial<ISlotBooking>,
  ): Promise<ISlotBookingModel> {
    return await this.create(bookingData);
  }

  async findBooking(
    learnerId: Types.ObjectId,
    courseId: Types.ObjectId,
  ): Promise<ISlotBookingModel | null> {
    return await this.findOne({ learnerId, courseId });
  }

  async findSlots(
    quesry: FilterQuery<ISlotBooking>,
  ): Promise<ISlotBookingModel | null> {
    return await this.findOne(quesry);
  }

  async findAllSlots(
    query: FilterQuery<ISlotBooking>,
  ): Promise<ISlotBookingModel[] | null> {
    return await this.find(query);
  }
  async updateSlotBookingData(
    filter: FilterQuery<ISlotBookingModel>,
    data: UpdateQuery<ISlotBookingModel>,
  ): Promise<ISlotBookingModel | null> {
    return await this.findOneAndUpdate(filter, data);
  }

  async listbookedSlots(
    filter: FilterQuery<ISlotBookingModel>,
    limit?: number,
    skip?: number,
  ): Promise<IPopulatedBooking[]> {
    return await this.findAll(
      filter,
      limit,
      skip,
      ["learnerId", "courseId", "mentorId"],
      true,
    );
  }
  async learnerDashboardSlotCard(learnerId: Types.ObjectId): Promise<LearnerSlotCard[]> {
    return await this.aggregate<LearnerSlotCard>([{
      $group:{
        _id:`$${learnerId}`,
        totalSession:{
          $sum:1
        },
        totalCracked:{
          $sum:{
            $cond:[
              {$eq:['$studentStatus',StudenStatus.PASSED]},
              1,
              0
            ]
          }
        },
        totalFailed:{
          $sum:{
            $cond:[
              {$eq:['$studentStatus',StudenStatus.FAILED]},
              1,
              0
            ]
          }
        }

      }
    }])
  }
}
