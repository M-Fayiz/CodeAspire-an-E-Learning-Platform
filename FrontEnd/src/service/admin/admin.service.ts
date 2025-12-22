import { axiosInstance } from "@/axios/createInstance";
import { API } from "@/constants/api.constant";
import type { IUserType, mentorApprovalStatus } from "@/types/users.type";

// import { searchFromParser } from "@/utility/parser.util";
// import type { SearchQuery } from "@/types/parser.types";
import { sharedService } from "../shared.service";
import { throwAxiosError } from "@/utility/throwErrot";
import type { IAdminDashboardDTO } from "@/types/DTOS/adminDashboard.type";

interface fetchedUsers {
  users: IUserType[];
  totalPage: number;
}

export const adminService = {
  fetchAllUsers: async (
    page: number,
    searchQuery: string,
  ): Promise<fetchedUsers> => {
    // const queryData = searchFromParser(searchQuery);
    try {
      const response = await axiosInstance.get(API.ADMIN.FETCH_ALL_USERS, {
        params: { page, searchQuery },
      });
      console.log(response?.data);

      return response?.data;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  blockUser: async (id: string): Promise<{ isActive: boolean; id: string }> => {
    try {
      const response = await axiosInstance.delete(API.ADMIN.BLOCK_USER(id));
      console.log(response.data.result);

      return response.data.result;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  userProfile: async (userId: string): Promise<IUserType> => {
    try {
      const response = await axiosInstance.get(
        API.ADMIN.GET_USER_PROFILE(userId),
      );

      if (response.data.userData.profilePicture) {
        const imageURL = await sharedService.getPreSignedDownloadURL(
          response.data.userData.profilePicture as string,
        );
        response.data.userData.profilePicture = imageURL;
      }

      if (response.data.userData.resume) {
        const resume = await sharedService.getPreSignedDownloadURL(
          response.data.userData.resume as string,
        );
        response.data.userData.resume = resume;
      }

      return response.data.userData;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  approveMentor: async (
    id: string,
    status: string,
    feedback?: string,
  ): Promise<{ status: mentorApprovalStatus }> => {
    try {
      const response = await axiosInstance.put(API.ADMIN.APPROVE_MENTOR(id), {
        status,
        feedback,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  getDashboardCardsdata: async (filter:string): Promise<IAdminDashboardDTO> => {
    try {
      
      const response = await axiosInstance.get(API.ADMIN.DASHBOARD_CARD,{
        params:{filter}
      });
      return response.data.dashBoardData;
    } catch (error) {
      throwAxiosError(error);
    }
  },
};
