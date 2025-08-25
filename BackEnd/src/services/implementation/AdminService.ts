import { HttpResponse } from "../../const/error-message";
import { HttpStatus } from "../../const/http-status";
import { ILearnerModel, IMenterModel } from "../../models/user.model";
import { IUserRepo } from "../../repository/interface/IUserRepo";
import { createHttpError } from "../../utility/http-error";
import { IAdminService } from "../interface/IAdminService";
import { parseObjectId } from "../../mongoose/objectId";
import { LearnerDTO, MentorDTO } from "../../dtos/role.dto";
import {
  ILearnerDTO,
  IMentorDTO,
} from "../../types/dtos.type/dto.types";
import { mentorApprovalStatus } from "../../types/user.types";

export type UserFetchResponse = {
  safeUsers: IMentorDTO | ILearnerDTO[];
  totalPage: number;
};

export class AdminService implements IAdminService {
  constructor(private _userRepo: IUserRepo) {}

  async fetchAllUsers(
    page: number,
    isActive: boolean | "",
    name: string,
    role: string,
  ): Promise<UserFetchResponse> {
    const limit = 3;
    const skip = (page - 1) * limit;

    const searchQuery = {
      name: name,
      role: role,
      isActive: isActive,
    };

    const [allUsers, userCount] = await Promise.all([
      this._userRepo.findAllUsers(limit, skip, searchQuery),
      this._userRepo.findUserCount(searchQuery),
    ]);
    if (!allUsers) {
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.SERVER_ERROR,
      );
    }

    const safeUsers = allUsers.map((user) => {
      switch (user.role) {
        case "mentor":
          return MentorDTO(user as IMenterModel);
        case "learner":
          return LearnerDTO(user as ILearnerModel);
        default:
          return {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            profilePicture: user.profilePicture,
            isActive: user.isActive,
            role: user.role,
            ApprovalStatus: user.ApprovalStatus,
          };
      }
    });
    const totalPage = Math.ceil(userCount / limit);
    return { safeUsers, totalPage };
  }

  async blockUser(id: string): Promise<{ isActive: boolean; id: string }> {
    const objectId = parseObjectId(id);
    if (!objectId) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.INVALID_CREDNTIALS,
      );
    }

    const updatedUser = await this._userRepo.blockUser(objectId);

    if (!updatedUser) {
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.SERVER_ERROR,
      );
    }
    const result = {
      isActive: updatedUser.isActive,
      id: updatedUser.id,
    };
    return result;
  }
  async userProfile(id: string): Promise<ILearnerDTO | IMentorDTO | null> {
    const objectId = parseObjectId(id);
    if (!objectId) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.INVALID_CREDNTIALS,
      );
    }

    const profileData = await this._userRepo.findUserById(objectId);
    if (!profileData) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
    }

    switch (profileData.role) {
      case "mentor":
        return MentorDTO(profileData as IMenterModel);
      case "learner":
        return LearnerDTO(profileData as ILearnerModel);
      default:
        return {
          id: profileData._id,
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          profilePicture: profileData.profilePicture,
          isActive: profileData.isActive,
          role: profileData.role,
          ApprovalStatus: profileData.ApprovalStatus,
          isRequested: profileData.isRequested,
        };
    }
  }
  async approveMentor(
    id: string,
  ): Promise<{ ApprovalStatus: mentorApprovalStatus }> {
    const objectId = parseObjectId(id);
    if (!objectId) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.INVALID_CREDNTIALS,
      );
    }
    const approvedData = await this._userRepo.updateMentorStatus(
      objectId,
      "approved",
    );
    if (!approvedData) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
    }

    return { ApprovalStatus: approvedData.ApprovalStatus };
  }
}
