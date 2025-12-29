import { IUserService } from "../interface/IUserService";
import { IUserRepo } from "../../repository/interface/IUserRepo";
import {
  IAdminModel,
  ILearnerModel,
  IMenterModel,
} from "../../models/user.model";
import { createHttpError } from "../../utils/http-error";
import { HttpStatus } from "../../const/http-status.const";
import { HttpResponse } from "../../const/error-message.const";
import {
  IAdmin,
  ILearner,
  IRole,
  mentorApprovalStatus,
} from "../../types/user.types";
import { parseObjectId } from "../../mongoose/objectId";
import { comparePassword, hashPassword } from "../../utils/bcrypt.util";

import { IMentorRepository } from "../../repository/interface/IMentorRepository";
import { AdminDTO, LearnerDTO, MentorDTO } from "../../dtos/role.dto";
import {
  IAdminDTO,
  ILearnerDTO,
  IMentorDTO,
} from "../../types/dtos.type/user.dto.types";
// import logger from "../../config/logger.config";
import { NotificationTemplates } from "../../template/notification.template";
import { INotificationRepository } from "../../repository/interface/INotificationRepository";
import { INotificationDTO } from "../../types/dtos.type/notification.dto.types";

export class UserService implements IUserService {
  constructor(
    private _userRepository: IUserRepo,
    private _mentorRepository: IMentorRepository,
    private _notificationRepository: INotificationRepository,
  ) {}

  async fetchUser(
    id: string,
  ): Promise<ILearnerDTO | IMentorDTO | IAdminDTO | null> {
    const userId = parseObjectId(id);
    if (!userId) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.INVALID_ID);
    }
    const userData = await this._userRepository.getUserProfile(userId);
    if (!userData) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
    }
    switch (userData.role) {
      case IRole.Admin:
        return userData as unknown as IAdminDTO;

      case IRole.Mentor:
        return userData as unknown as IMentorDTO;
      case IRole.Learner:
        return userData as unknown as ILearnerDTO;
      default:
        return null;
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
    const user = await this._userRepository.findUserById(objectId);
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
    await this._userRepository.updateUserPassword(user.email, hashedPassword);

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
    const userData = await this._userRepository.userProfilePictureUpdate(
      userObjectId,
      imageURL,
    );
    if (!userData || !userData.profilePicture) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
    }
    return userData.profilePicture;
  }
  async updateUserProfile<T extends ILearner | IMenterModel | IAdmin>(
    id: string,
    userData: T,
  ): Promise<IMentorDTO | ILearnerDTO | IAdminDTO | null> {
    const userId = parseObjectId(id);
    if (!userId) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.INVALID_CREDNTIALS,
      );
    }

    const user = await this._userRepository.findUserById(userId);
    if (!user) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
    }

    const updateActions = {
      mentor: async () => {
        const result = await this._mentorRepository.updateMentorProfile(
          userId,
          userData as IMenterModel,
        );
        return result ? MentorDTO(result) : null;
      },
      admin: async () => {
        const result = await this._userRepository.updateUserprofile(
          userId,
          userData as IAdminModel,
        );
        return result ? AdminDTO(result as IAdminModel) : null;
      },
      learner: async () => {
        const result = await this._userRepository.updateUserprofile(
          userId,
          userData as ILearnerModel,
        );
        return result ? LearnerDTO(result as ILearnerModel) : null;
      },
    } as const;

    const handler = updateActions[user.role as keyof typeof updateActions];
    if (!handler) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        `Invalid user role: ${user.role}`,
      );
    }

    return handler();
  }

  async getUserProfile(
    userId: string,
  ): Promise<IAdminDTO | ILearnerDTO | IMentorDTO | null> {
    const id = parseObjectId(userId);
    if (!id) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.INVALID_ID);
    }

    const userData = await this._userRepository.getUserProfile(id);
    if (userData?.role == IRole.Admin) return AdminDTO(userData as IAdminModel);
    if (userData?.role == IRole.Mentor)
      return MentorDTO(userData as IMenterModel);
    if (userData?.role == IRole.Learner)
      return LearnerDTO(userData as ILearnerModel);
    return null;
  }
  async addMentorData(
    mentorId: string,
    mentorData: IMenterModel,
  ): Promise<{ MentorDtp: IMentorDTO; notificationDTO: INotificationDTO }> {
    const mentor_Id = parseObjectId(mentorId);
    if (!mentor_Id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }
    const updateMentorData = await this._mentorRepository.updateMentorProfile(
      mentor_Id,
      {
        ...mentorData,
        ApprovalStatus: mentorApprovalStatus.REQUESTED,
      } as IMenterModel,
    );
    if (!updateMentorData) {
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.SERVER_ERROR,
      );
    }
    const adminId = await this._userRepository.findUser({ role: IRole.Admin });

    const notificationData = NotificationTemplates.mentorRequest(
      adminId!._id,
      updateMentorData.name,
      updateMentorData._id,
    );

    const NotificationData =
      await this._notificationRepository.createNotification(notificationData);

    return {
      MentorDtp: MentorDTO(updateMentorData as IMenterModel),
      notificationDTO: NotificationData,
    };
  }
}
