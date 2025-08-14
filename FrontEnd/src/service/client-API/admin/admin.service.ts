import type { AxiosError } from "axios";

import { axiosInstance } from "@/axios/createInstance";
import { API } from "@/constants/api.constant";
import type { IUserType } from "@/types/users.type";

import { searchFromParser } from "@/utility/parser.util";
import type { SearchQuery } from "@/types/parser.types";

interface fetchedUsers {
  users: IUserType[];
  totalPage: number;
}

export const adminService = {
  fetchAllUsers: async (
    page: number,
    searchQuery: SearchQuery,
  ): Promise<fetchedUsers> => {
    const queryData = searchFromParser(searchQuery);
    try {
      const response = await axiosInstance.get(API.ADMIN.FETCH_ALL_USERS, {
        params: { page, ...queryData },
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

      return response.data.userData;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error;
      throw new Error(errorMessage);
    }
  },
  approveMentor: async (id: string): Promise<{ isApproved: boolean }> => {
    try {
      const response = await axiosInstance.put(API.ADMIN.APPROVE_MENTOR(id));
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error;
      throw new Error(errorMessage);
    }
  },
};
