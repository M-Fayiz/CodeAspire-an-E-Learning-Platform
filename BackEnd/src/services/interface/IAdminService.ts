import { FilterByDate } from "../../const/filter.const";
import { IAdminDashboardDTO } from "../../types/dtos.type/adminDashboard.dto.type";
import { INotificationDTO } from "../../types/dtos.type/notification.dto.types";
import { ILearnerDTO, IMentorDTO } from "../../types/dtos.type/user.dto.types";
import { mentorApprovalStatus } from "../../types/user.types";
import { UserFetchResponse } from "../implementation/AdminService";

export interface IAdminService {
  fetchAllUsers(page: number, search: string): Promise<UserFetchResponse>;
  blockUser(id: string): Promise<{ isActive: boolean; id: string }>;
  userProfile(userId: string): Promise<ILearnerDTO | IMentorDTO | null>;
  approveMentor(
    id: string,
    status: mentorApprovalStatus,
    feedback?: string,
  ): Promise<{
    status: mentorApprovalStatus;
    notification: INotificationDTO;
  }>;
  getDashboardData(
    filter?: FilterByDate,
    start?: string,
    end?: string,
  ): Promise<IAdminDashboardDTO>;
}
