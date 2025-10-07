import { IUserService } from "../interface/IUserService";
import { IUserRepo } from "../../repository/interface/IUserRepo";
import {
  IAdminModel,
  ILearnerModel,
  IMenterModel,
} from "../../models/user.model";
import { createHttpError } from "../../utility/http-error";
import { HttpStatus } from "../../const/http-status";
import { HttpResponse } from "../../const/error-message";
import { IAdmin, ILearner, IRole } from "../../types/user.types";
import { parseObjectId } from "../../mongoose/objectId";
import { comparePassword, hashPassword } from "../../utility/bcrypt.util";

import { IMentorRepository } from "../../repository/interface/IMentorRepository";
import { AdminDTO, LearnerDTO, MentorDTO } from "../../dtos/role.dto";
import {
  IAdminDTO,
  ILearnerDTO,
  IMentorDTO,
} from "../../types/dtos.type/dto.types";
import logger from "../../config/logger.config";

export class UserService implements IUserService {
  constructor(
    private _userRep: IUserRepo,
    private _mentorRepository: IMentorRepository,
  ) {}

  async fetchUser(id: string): Promise<ILearnerDTO | IMentorDTO | IAdminDTO> {
    const userId = parseObjectId(id);
    if (!userId) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.INVALID_ID);
    }
    const userData = await this._userRep.getUserProfile(userId);
    if (!userData) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
    }
    switch (userData.role) {
      case "learner":
        return LearnerDTO(userData as ILearnerModel);
      case "mentor":
        return MentorDTO(userData as IMenterModel);
      case "admin":
        return AdminDTO(userData as IAdminModel);
    }
  }

  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const objectId = parseObjectId(id);
    if (!objectId) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.INVALID_CREDNTIALS,
      );
    }
    const user = await this._userRep.findUserById(objectId);
    if (!user) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
    }

    const passwordIsMatch = await comparePassword(
      currentPassword,
      user.password,
    );

    if (!passwordIsMatch) {
      throw createHttpError(
        HttpStatus.NOT_FOUND,
        HttpResponse.INVALID_CREDNTIALS,
      );
    }
    const hashedPassword = await hashPassword(newPassword);
    await this._userRep.updateUserPassword(user.email, hashedPassword);

    return true;
  }
  async userProfilePitcureUpdate(
    imageURL: string,
    userId: string,
  ): Promise<string> {
    const userObjectId = parseObjectId(userId);
    if (!userObjectId) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.INVALID_CREDNTIALS,
      );
    }
    const userData = await this._userRep.userProfilePictureUpdate(
      userObjectId,
      imageURL,
    );
    if (!userData || !userData.profilePicture) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
    }
    return userData.profilePicture;
  }
  async updateUserProfile(
    id: string,
    userData: ILearner | IMenterModel | IAdmin,
  ): Promise<IMentorDTO | null> {
    const userId = parseObjectId(id);
    if (!userId) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.INVALID_CREDNTIALS,
      );
    }
    const user = await this._userRep.findUserById(userId);
    if (!user) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
    }

    switch (user.role) {
      case "mentor": {
        const updatedMentor = await this._mentorRepository.updateMentorProfile(
          userId,
          userData as IMenterModel,
        );
        return updatedMentor ? MentorDTO(updatedMentor) : null;
      }
      case "admin": {
        const updatedAdmin = await this._userRep.updateUserprofile(
          userId,
          userData as IAdminModel,
        );
        logger.info("admin data fron service", { updatedAdmin });
        return updatedAdmin ? AdminDTO(updatedAdmin as IAdminModel) : null;
      }
      case "learner": {
        const updatedLearner = await this._userRep.updateUserprofile(
          userId,
          userData as ILearnerModel,
        );
        return updatedLearner
          ? LearnerDTO(updatedLearner as ILearnerModel)
          : null;
      }
    }
  }
  async getUserProfile(
    userId: string,
  ): Promise<IAdminDTO | ILearnerDTO | IMentorDTO | null> {
    const id = parseObjectId(userId);
    if (!id) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.INVALID_ID);
    }

    const userData = await this._userRep.getUserProfile(id);
    if (userData?.role == IRole.Admin) return AdminDTO(userData as IAdminModel);
    if (userData?.role == IRole.Mentor)
      return MentorDTO(userData as IMenterModel);
    if (userData?.role == IRole.Learner)
      return LearnerDTO(userData as ILearnerModel);
    return null;
  }
}
