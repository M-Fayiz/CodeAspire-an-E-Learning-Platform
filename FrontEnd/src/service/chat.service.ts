import { axiosInstance } from "@/axios/createInstance";
import { API } from "@/constants/api.constant";
import type { IChatDTO, IChatListDTO } from "@/types/DTOS/chat.dto.type";
import { throwAxiosError } from "@/utility/throwErrot";
import { sharedService } from "./shared.service";
import type { IMessageDto } from "@/types/DTOS/message.dto.types";

export const ChatService = {
  createChat: async (
    senderId: string,
    receiverId: string,
  ): Promise<IChatDTO> => {
    try {
      const response = await axiosInstance.post(API.CHAT.CREATE_CHAT, {
        senderId,
        receiverId,
      });
      return response.data.chatData;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  ListUsers: async (senderId: string): Promise<IChatListDTO[]> => {
    try {
      const response = await axiosInstance.get(API.CHAT.LIST_USERS(senderId));
      const updatedUsers = await Promise.all(
        response.data.ChatUser.map(async (data: IChatListDTO) => {
          let pictureURL;
          if (data.user.profile) {
            pictureURL = await sharedService.getPreSignedDownloadURL(
              data.user.profile,
            );
          }
          if (!pictureURL) {
            pictureURL = "👤";
          }
          return {
            ...data,
            user: {
              ...data.user,
              profile: pictureURL,
            },
          };
        }),
      );
      
      return updatedUsers;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  getChatMessage: async (chatId: string): Promise<IMessageDto[]> => {
    try {
      const response = await axiosInstance.get(API.CHAT.GET_MESSAGE(chatId));

      const updatedMessage = await Promise.all(
        response.data.messages.map(async (data: IMessageDto) => {
          let pictureURL;
          if (data.mediaUrl) {
            pictureURL = await sharedService.getPreSignedDownloadURL(
              data.mediaUrl as string,
            );
          }

          return {
            ...data,

            mediaUrl: pictureURL,
          };
        }),
      );

      return updatedMessage;
    } catch (error) {
      throwAxiosError(error);
    }
  },
};
