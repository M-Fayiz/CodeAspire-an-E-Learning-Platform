import { ILearnerDTO, IMentorDTO } from "../../types/dtos.type/dto.types";
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
  userProfile(id: string): Promise<ILearnerDTO | IMentorDTO | null>;
  approveMentor(
    id: string,
    status: string,
  ): Promise<{
    status: mentorApprovalStatus;
    notify: { userId: string; message: string };
  }>;
  getDashboardData(
    filter?: filter,
    start?: string,
    end?: string,
  ): Promise<void>;
}
