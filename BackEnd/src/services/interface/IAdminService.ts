import { INotificationDTO } from "../../types/dtos.type/notification.dto.types";
import { ILearnerDTO, IMentorDTO } from "../../types/dtos.type/user.dto.types";
import { filter } from "../../types/enrollment.types";
import { mentorApprovalStatus } from "../../types/user.types";
import { UserFetchResponse } from "../implementation/AdminService";

export interface IAdminService {
  fetchAllUsers(
    page: number,
    isActive: boolean | "",
    name: string,
    role: string,
  ): Promise<UserFetchResponse>;
  blockUser(id: string): Promise<{ isActive: boolean; id: string }>;
  userProfile(userId: string): Promise<ILearnerDTO | IMentorDTO | null>;
  approveMentor(
    id: string,
    status: "approved" | "rejected",
    feedback?: string,
  ): Promise<{
    status: mentorApprovalStatus;
    notification: INotificationDTO;
  }>;
  getDashboardData(
    filter?: filter,
    start?: string,
    end?: string,
  ): Promise<void>;
}
