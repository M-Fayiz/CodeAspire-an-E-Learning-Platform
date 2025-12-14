import { IMentor, ILearner, IAdmin, IUser } from "../../types/user.types";
import {
  IAdminDTO,
  ILearnerDTO,
  IMentorDTO,
} from "../../types/dtos.type/user.dto.types";
import { IMenterModel } from "../../models/user.model";
import { INotificationDTO } from "../../types/dtos.type/notification.dto.types";

export interface IUserService {
  fetchUser(id: string): Promise<ILearnerDTO | IMentorDTO | IAdminDTO  |null>;
  changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean>;
  userProfilePitcureUpdate(imageURL: string, userId: string): Promise<string>;
  updateUserProfile(
    id: string,
    userData: ILearner | IMentor | IAdmin,
  ): Promise<IMentorDTO | IMentorDTO | IAdminDTO | null>;
  getUserProfile(
    userId: string,
  ): Promise<IAdminDTO | ILearnerDTO | IMentorDTO | null>;
  addMentorData(
    mentorId: string,
    mentorData: IMenterModel,
  ): Promise<{ MentorDtp: IMentorDTO; notificationDTO: INotificationDTO }>;
}
