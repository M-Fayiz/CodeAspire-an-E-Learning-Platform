import type { AxiosError } from "axios";

import { axiosInstance } from "@/axios/createInstance";
import { API } from "@/constants/api.constant";
import type { IUserType, mentorApprovalStatus } from "@/types/users.type";

// import { searchFromParser } from "@/utility/parser.util";
// import type { SearchQuery } from "@/types/parser.types";
import { sharedService } from "../shared.service";

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
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error;
      throw new Error(errorMessage);
    }
  },
  blockUser: async (id: string): Promise<{ isActive: boolean; id: string }> => {
    try {
      const response = await axiosInstance.delete(API.ADMIN.BLOCK_USER(id));
      console.log(response.data.result);

      return response.data.result;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error;
      throw new Error(errorMessage);
    }
  },
  userProfile: async (id: string): Promise<IUserType> => {
    try {
      const response = await axiosInstance.get(API.ADMIN.GET_USER_PROFILE(id), {
        params: { id },
      });
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
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error;
      throw new Error(errorMessage);
    }
  },
  approveMentor: async (
    id: string,
    status: string,
  ): Promise<{ status: mentorApprovalStatus }> => {
    try {
      const response = await axiosInstance.put(API.ADMIN.APPROVE_MENTOR(id), {
        status,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error;
      throw new Error(errorMessage);
    }
  },
};
