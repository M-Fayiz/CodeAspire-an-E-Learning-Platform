import { IChatModel } from "../models/chat.model";
import {
  IChatDTO,
  IChatListDTO,
  IChatPopulated,
} from "../types/dtos.type/chat.dto.types";

export function chatDto(data: IChatModel): IChatDTO {
  return {
    _id: data._id,
    participantKey: data.participantKey,
    users: data.users,
    latestMessage: data.latestMessage ?? null,
    lastMessageTime: data.lastMessageTime,
    createdAt: data.createdAt,
  };
}

export function chatListDTO(data: IChatPopulated): IChatListDTO {

  return {
    _id: data._id,
    latestMessage: data.latestMessage,
    participantKey: data.participantKey,
    user: {
      _id: data.users[0]._id,
      name: data.users[0].name,
      profile: data.users[0].profilePicture as string,
    },
    lastMessageTime: data.lastMessageTime,
    createdAt: data.createdAt,
  };
}
