



export interface IChatDTO {
  _id: string;
  users: string[];
  participantKey: string;
  latestMessage: string | null;
  createdAt?: Date;
}
