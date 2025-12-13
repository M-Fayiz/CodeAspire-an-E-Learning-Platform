export interface IBaseChatDTO {
  _id: string;
  participantKey: string;
  latestMessage: string | null;
  createdAt?: Date | string;
}

export interface IChatDTO extends IBaseChatDTO {
  users: string[];
}

export interface IChatListDTO extends IBaseChatDTO {
  user: {
    _id: string;
    name: string;
    profile: string;
  };
  unread: number;
}
