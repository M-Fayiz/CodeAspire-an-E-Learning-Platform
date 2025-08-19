import { AxiosError } from "axios";
import { axiosInstance } from "../../axios/createInstance";
import { API } from "@/constants/api.constant";

export const sharedService = {
  getS3BucketUploadUrl: async (
    file: File,
  ): Promise<{ uploadURL: string; fileURL: string }> => {
    try {
      const response = await axiosInstance.get(
        API.SHARED.UPLOAD_PUT_PRESIGNED_URL,
        {
          params: {
            fileName: file.name,
            type: file.type,
          },
        },
      );
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error;
      throw new Error(errorMessage);
    }
  },
  uploadToS3: async (uploadURL: string, file: File) => {
    try {
      await axiosInstance.put(uploadURL, file, {
        headers: { "Content-Type": file.type },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  },
  getPreSignedDownloadURL: async (fileName: string) => {
    try {
      const response = await axiosInstance.get(
        API.SHARED.DOWNLOAD_GET_PRESIGNED_URL,
        {
          params: { key: fileName },
        },
      );
      console.log("v v v ", response.data.get_fileURL);
      return response.data.get_fileURL;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  },
};
