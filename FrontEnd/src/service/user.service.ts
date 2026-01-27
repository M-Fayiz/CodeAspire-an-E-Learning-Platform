import { axiosInstance } from "../axios/createInstance";
import { API } from "../constants/api.constant";
import type { AnyUser, BaseUser } from "../types/users.type";
import type { IMentorProps } from "../types/mentor.types";
import { sharedService } from "./shared.service";
import { throwAxiosError } from "@/utility/throwErrot";

const UserService = {
  fetchProfile: async (): Promise<AnyUser> => {
    try {
      const response = await axiosInstance.get(API.USER.FETCH_USER_PROFILE);

      return response.data.userData;
    } catch (error) {
      throwAxiosError(error)
    }
  },
  changePassword: async (
   
    currentPassword: string,
    newPassword: string,
  ): Promise<{ status: number; message: string }> => {
    try {
      const response = await axiosInstance.patch(API.USER.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
     throwAxiosError(error)
    }
  },
  uploadImageIntoS3: async (
    uploadURL: string,
    fileURL: string,
    file: File,
    
  ) => {
    try {
      await sharedService.uploadToS3(uploadURL, file);
      const response = await axiosInstance.put(
        API.USER.UPDATE_PROFILE_PICTURE,
        { imageURL: fileURL },
      );
      return await sharedService.getPreSignedDownloadURL(response.data.imgURL);
    } catch (error) {
     throwAxiosError(error)
    }
  },
  updateMentorInformation: async (
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
        API.USER.UPDATE_MENTOR_PROFILE,
        { ...mentorData, isRequested: true },
      );

      return response.data;
    } catch (error) {
     throwAxiosError(error)
    }
  },
  updateProfile: async ( userData: Partial<BaseUser>) => {
    try {
      const response = await axiosInstance.put(
        API.USER.UPDATE_USER_PROFILE,
        { ...userData },
      );

      return response.data;
    } catch (error) {
     throwAxiosError(error)
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

      if (imageURL) {
        response.data.userData.profilePicture = imageURL;
      }

      return response.data.userData;
    } catch (error) {
     throwAxiosError(error)
    }
  },
};

export default UserService;
