import { IMenterModel, MentorModel } from "../../models/user.model";
import { BaseRepository } from "../baseRepository";
import { IMentorRepository } from "../interface/IMentorRepository";
import { Types } from "mongoose";

export class MentorRepository
  extends BaseRepository<IMenterModel>
  implements IMentorRepository
{
  constructor() {
    super(MentorModel);
  }

  async updateMentorProfile(
    id: Types.ObjectId,
    update: Partial<IMenterModel>,
  ): Promise<IMenterModel | null> {
    return await this.findByIDAndUpdateProfile(id, update);
  }
}
