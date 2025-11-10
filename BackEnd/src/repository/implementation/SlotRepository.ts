import { FilterQuery, Types } from "mongoose";
import { ISlotModel, SlotModel } from "../../models/slot.model";
import { BaseRepository } from "../baseRepository";
import { ISlotRepository } from "../interface/ISlotRepository";
import { slotDays } from "../../types/slot.type";
import { ISlotPopulatedDTO } from "../../types/dtos.type/slots.dto.type";

export class SlotRepository
  extends BaseRepository<ISlotModel>
  implements ISlotRepository
{
  constructor() {
    super(SlotModel);
  }

  async createSlot(slotData: Partial<ISlotModel>): Promise<ISlotModel> {
    return await this.create(slotData);
  }
  async getMentorSLots(mentorId: Types.ObjectId): Promise<ISlotModel[] | null> {
    return await this.find({ mentorId: mentorId });
  }
  async findSlot(
    mentorId: Types.ObjectId,
    selectedDays: slotDays[],
    startTime: string,
    endTime: string,
    excludeSlotId?: Types.ObjectId,
  ): Promise<ISlotModel | null> {
    let query: FilterQuery<ISlotModel> = {
      mentorId,
      selectedDays: { $in: selectedDays },
      $and: [{ startTime: { $lt: endTime } }, { endTime: { $gt: startTime } }],
    };
    if (excludeSlotId) {
      query._id = { $ne: excludeSlotId };
    }
    return await this.findOne(query);
  }
  async updateSlot(
    slotId: Types.ObjectId,
    slotData: ISlotModel,
  ): Promise<ISlotModel | null> {
    return await this.findByIDAndUpdate(slotId, slotData);
  }
  async getCourseSlot(
    courseId: Types.ObjectId,
  ): Promise<ISlotPopulatedDTO | null> {
    return await this.findOne<ISlotPopulatedDTO>({ courseId }, [
      "courseId",
      "mentorId",
    ]);
  }
  async findSlotByFilter(
    filter: FilterQuery<ISlotModel>,
  ): Promise<ISlotModel | null> {
    return await this.findOne(filter);
  }
}
