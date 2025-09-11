import { BaseRepository } from "../baseRepository";
import {
  UserModel,
  IUserModel,
  IMenterModel,
  ILearnerModel,
  IAdminModel,
} from "../../models/user.model";
import { IUserRepo } from "../interface/IUserRepo";
import { Profile } from "passport-google-oauth20";
import { IUserRole, searchProps } from "../../types/user.types";
import { Types } from "mongoose";
import { buildUserFilter } from "../../utility/searchQuery";

export class UserRepository
  extends BaseRepository<IUserModel>
  implements IUserRepo
{
  constructor() {
    super(UserModel);
  }
  async createUser(user: IUserModel): Promise<IUserModel> {
    const createdUser = await this.create(user);

    return createdUser;
  }

  async findUserByEmail(
    email: string,
  ): Promise<IUserModel | IMenterModel | ILearnerModel | IAdminModel | null> {
    const user = await this.model.findOne({ email }).lean();
    if (!user) return null;
    switch (user?.role) {
      case "mentor":
        return user as unknown as IMenterModel;
      case "learner":
        return user as unknown as ILearnerModel;
      case "admin":
        return user as IAdminModel;
      default:
        return user as IUserModel;
    }
  }
  async updateUserPassword(
    email: string,
    password: string,
  ): Promise<IUserModel | null> {
    return await this.findUserAndUpdate(
      { email },
      { $set: { password: password } },
      { new: true },
    );
  }
  async findOrCreateUser(
    profile: Profile,
    role?: IUserRole,
  ): Promise<IUserModel | null> {
    let user = await this.findOne({
      $or: [{ googleId: profile.id }, { email: profile.emails?.[0].value }],
    });

    if (!user) {
      user = await this.create({
        googleId: profile.id,
        email: profile.emails?.[0].value,
        name: profile.displayName,
        role: role,
      });
    }
    return user;
  }

  async findAllUsers(
    limit: number,
    skip: number,
    searchQuery: searchProps,
  ): Promise<IUserModel[] | null> {
    const filter = buildUserFilter(searchQuery);
    return this.model
      .find(filter)
      .select("-password -googleId")
      .skip(skip)
      .limit(limit);
  }

  async findUserCount(searchQuery: searchProps): Promise<number | 0> {
    const filter = buildUserFilter(searchQuery);
    return this.model.countDocuments(filter);
  }
  async blockUser(id: Types.ObjectId): Promise<IUserModel | null> {
    return this.model.findByIdAndUpdate(
      id,
      [{ $set: { isActive: { $not: "$isActive" } } }],
      {
        new: true,
        upsert: false,
      },
    );
  }
  async findUserById(id: Types.ObjectId): Promise<IUserModel | null> {
    return await this.findById(id);
  }

  async userProfilePictureUpdate(
    id: Types.ObjectId,
    imageURL: string,
  ): Promise<IUserModel | null> {
    return await this.model.findByIdAndUpdate(
      id,
      { profilePicture: imageURL },
      { new: true },
    );
  }
  async updateMentorStatus(
    id: Types.ObjectId,
    status: string,
  ): Promise<IUserModel | null> {
    return await this.findByIDAndUpdate(id, { ApprovalStatus: status });
  }
  async updateUserprofile(
    id: Types.ObjectId,
    profileData: Partial<
      IUserModel | IMenterModel | ILearnerModel | IAdminModel
    >,
  ): Promise<IUserModel | IMenterModel | ILearnerModel | IAdminModel | null> {
    return await this.findByIDAndUpdate(id, { profileData });
  }
  async getUserProfile(
    userId: Types.ObjectId,
  ): Promise<IUserModel | IMenterModel | ILearnerModel | IAdminModel | null> {
    return await this.findOne({ _id: userId });
  }
}
