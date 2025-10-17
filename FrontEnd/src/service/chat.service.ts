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
          const pictureURL = await sharedService.getPreSignedDownloadURL(
            data.user.profile,
          );

          return {
            ...data,
            user: {
              ...data.user,
              profile: pictureURL,
            },
          };
        }),
      );
      console.log("u[date User ", updatedUsers);
      return updatedUsers;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  getChatMessage: async (chatId: string): Promise<IMessageDto[]> => {
    try {
      const response = await axiosInstance.get(API.CHAT.GET_MESSAGE(chatId));
      return response.data.messages;
    } catch (error) {
      throwAxiosError(error);
    }
  },
};
