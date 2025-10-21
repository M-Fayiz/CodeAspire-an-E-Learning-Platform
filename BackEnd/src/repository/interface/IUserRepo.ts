import { Profile } from "passport-google-oauth20";
import {
  IUserModel,
  IMenterModel,
  ILearnerModel,
  IAdminModel,
} from "../../models/user.model";
import { IRole, searchProps } from "../../types/user.types";
import { FilterQuery, Types } from "mongoose";

export interface IUserRepo {
  createUser(user: IUserModel): Promise<IUserModel>;
  findUserByEmail(
    email: string,
  ): Promise<IUserModel | IMenterModel | ILearnerModel | IAdminModel | null>;
  updateUserPassword(
    email: string,
    password: string,
  ): Promise<IUserModel | IMenterModel | ILearnerModel | IAdminModel | null>;
  findOrCreateUser(
    profile: Profile,
    role?: IRole,
  ): Promise<IUserModel | IMenterModel | ILearnerModel | IAdminModel | null>;
  findAllUsers(
    limit: number,
    skip: number,
    searchQuery?: searchProps,
  ): Promise<
    IUserModel[] | IMenterModel[] | ILearnerModel[] | IAdminModel[] | null
  >;
  findUserCount(searchQuery?: searchProps): Promise<number | 0>;
  blockUser(
    id: Types.ObjectId,
  ): Promise<IUserModel | IMenterModel | ILearnerModel | IAdminModel | null>;
  findUserById(
    id: Types.ObjectId,
  ): Promise<IUserModel | IMenterModel | ILearnerModel | IAdminModel | null>;
  findByIDAndUpdate(
    id: Types.ObjectId,
    update: Partial<IUserModel>,
  ): Promise<IUserModel | IMenterModel | ILearnerModel | IAdminModel | null>;
  userProfilePictureUpdate(
    id: Types.ObjectId,
    imageURL: string,
  ): Promise<IUserModel | IMenterModel | ILearnerModel | IAdminModel | null>;
  updateMentorStatus(
    id: Types.ObjectId,
    status: "approved" | "rejected",
  ): Promise<IUserModel | null>;
  updateUserprofile(
    id: Types.ObjectId,
    profileData: Partial<
      IUserModel | IMenterModel | ILearnerModel | IAdminModel
    >,
  ): Promise<IUserModel | IMenterModel | ILearnerModel | IAdminModel | null>;
  getUserProfile(
    userId: Types.ObjectId,
  ): Promise<IUserModel | IMenterModel | ILearnerModel | IAdminModel | null>;
  findUser(
    filter: FilterQuery<IUserModel>,
  ): Promise<IUserModel | IMenterModel | ILearnerModel | IAdminModel | null>;
}
