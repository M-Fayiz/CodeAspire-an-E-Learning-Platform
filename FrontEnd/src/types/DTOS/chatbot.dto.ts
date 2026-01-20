export type Sender = "user" | "model";

export interface BotMessage {
  role: Sender;
  content: string;
  createdAt: Date; 
}

export interface ChatBot {
  learnerId: string;
  courseId: string;
  messages: BotMessage[];
}


export interface IchatbotUser{
   learnerId:string,
    courseId:string
    messages:string 
}