import { ChatEvents } from "../../const/socketEvents.const";

export interface ChatListenEvents {
  [ChatEvents.JOIN]: (payload: { roomId: string }) => void;
  [ChatEvents.SEND]: (
    payload: {
      roomId: string;
      content?: string;
      type?: "text" | "image";
      mediaUrl?: string;
      tempId?: string;
    },
    ack?: (response: { success?: boolean; error?: string }) => void,
  ) => void;
  [ChatEvents.DELIVERED]: (payload: {
    roomId: string;
    messageId: string;
  }) => void;
  [ChatEvents.READ]: (payload: {
    roomId: string;
    messageIds: string[];
  }) => void;
}

export interface ChatEmitEvents {
  [ChatEvents.NEW_MESSAGE]: (data: any) => void;
  [ChatEvents.NOTIFICATION]: (data: { roomId: string }) => void;
  [ChatEvents.STATUS_UPDARE]: (data: {
    messageId?: string;
    messageIds?: string[];
    status: string;
  }) => void;
  [ChatEvents.ERROR]: (data: { message: string }) => void;
}
