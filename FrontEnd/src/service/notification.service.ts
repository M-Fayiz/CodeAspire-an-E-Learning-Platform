import { axiosInstance } from "@/axios/createInstance";
import { API } from "@/constants/api.constant";
import type { INotificationDTO } from "@/types/DTOS/notification.dto";
import { throwAxiosError } from "@/utility/throwErrot";

export const NotificationService = {
  getNotification: async (userId: string): Promise<INotificationDTO[]> => {
    try {
      const response = await axiosInstance.get(
        API.NOTIFICATION.GET_NOTIFICATION(userId),
      );
      return response.data.notificationData;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  readNotification: async (notifyId: string): Promise<string> => {
    try {
      const response = await axiosInstance.put(
        API.NOTIFICATION.READ_NOTIFICATION(notifyId),
      );
      return response.data.readID;
    } catch (error) {
      throwAxiosError(error);
    }
  },
};
