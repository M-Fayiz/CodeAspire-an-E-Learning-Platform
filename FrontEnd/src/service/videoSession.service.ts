import { axiosInstance } from "@/axios/createInstance";
import { API } from "@/constants/api.constant";
import type { IVideoSessionDTO } from "@/types/DTOS/videoSession.dto";
import { throwAxiosError } from "@/utility/throwErrot";

const VideoService = {
  startVideoSession: async (bookingId: string): Promise<IVideoSessionDTO> => {
    console.log("boking :", bookingId);
    try {
      const response = await axiosInstance.get(
        API.VIDEO.START_VIDEO(bookingId),
      );
      return response.data.videoSessionData;
    } catch (error) {
      throwAxiosError(error);
    }
  },
};

export default VideoService;
