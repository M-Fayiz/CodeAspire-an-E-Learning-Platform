import type { AxiosError } from "axios";
import { axiosInstance } from "../../axios/createInstance";
import { API } from "../../constants/api.constant";
import type { AnyUser, BaseUser } from "../../types/users.type";
import type { IMentorProps } from "../../types/mentor.types";
import { sharedService } from "./shared.service";

const UserService = {
  fetchProfile: async (id: string): Promise<AnyUser> => {
    try {
      const response = await axiosInstance.get(API.USER.FETCH_USER_PROFILE(id));

      return response.data.userData;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error;
      throw new Error(errorMessage);
    }
  },
  changePassword: async (
    id: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ status: number; message: string }> => {
    try {
      const response = await axiosInstance.patch(API.USER.CHANGE_PASSWORD(id), {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error;
      throw new Error(errorMessage);
    }
  },
  uploadImageIntoS3: async (
    uploadURL: string,
    fileURL: string,
    file: File,
    userId: string,
  ) => {
    try {
      await sharedService.uploadToS3(uploadURL, file);
      const response = await axiosInstance.put(
        API.USER.UPDATE_PROFILE_PICTURE(userId),
        { imageURL: fileURL },
      );
      return await sharedService.getPreSignedDownloadURL(response.data.imgURL);
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error;
      throw new Error(errorMessage);
    }
  },
  updateMentorInformation: async (
    mentorId: string,
    mentorData: Partial<IMentorProps>,
  ) => {
    try {
      if (mentorData.resume) {
        const result = await sharedService.getS3BucketUploadUrl(
          mentorData.resume as File,
        );
        await sharedService.uploadToS3(
          result.uploadURL,
          mentorData.resume as File,
        );
        mentorData.resume = result.fileURL;
      }
      const response = await axiosInstance.put(
        API.USER.UPDATE_MENTOR_PROFILE(mentorId),
        { ...mentorData, isRequested: true },
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error;
      throw new Error(errorMessage);
    }
  },
  updateProfile: async (userId: string, userData: Partial<BaseUser>) => {
    console.log("thisis user data ", userData);
    try {
      const response = await axiosInstance.put(
        API.USER.UPDATE_USER_PROFILE(userId),
        { ...userData },
      );

      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error;
      throw new Error(errorMessage);
    }
  },
  getUserProfile: async (userId: string) => {
    try {
      const response = await axiosInstance.get(
        API.USER.GET_USER_PROFILE(userId),
      );
      const imageURL = await sharedService.getPreSignedDownloadURL(
        response.data.userData.profilePicture,
      );
      console.log(imageURL);
      if (imageURL) {
        response.data.userData.profilePicture = imageURL;
      }
      console.log(response.data.userData);
      return response.data.userData;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error;
      throw new Error(errorMessage);
    }
  },
};

export default UserService;
