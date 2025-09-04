import type { AxiosError } from "axios";
import { axiosInstance } from "../../axios/createInstance";
import { API } from "../../constants/api.constant";
import type { AnyUser, BaseUser } from "../../types/users.type";
import type { IMentorProps } from "../../types/mentor.types";
import { S3BucketUtil } from "../../utility/S3Bucket.util";
import { sharedService } from "./shared.service";

const UserService = {
  fetchProfile: async (email: string): Promise<AnyUser> => {
    try {
      const response = await axiosInstance.get(API.USER.FETCH_USER_PROFILE, {
        params: { email },
      });
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
      await S3BucketUtil.uploadToS3(uploadURL, file);
      const response = await axiosInstance.put(
        API.USER.UPDATE_PROFILE_PICTURE(userId),
        { imageURL: fileURL },
      );
      return await S3BucketUtil.getPreSignedURL(response.data.imgURL);
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
        const result = await S3BucketUtil.putPreSignedURL(mentorData.resume);
        await S3BucketUtil.uploadToS3(result.uploadURL, result.fileURL);
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
    console.log(" j j j  ", userId);
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
