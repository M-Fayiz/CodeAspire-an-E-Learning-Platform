import { Types } from "mongoose";
import { IChatModel } from "../../models/chat.model";


export interface IChatRespository{
    createChat(chatData:Partial<IChatModel>):Promise<IChatModel>
    getChat(prticipandtKey:string):Promise<IChatModel|null>
    findChatId(chatId:Types.ObjectId):Promise<IChatModel|null>
}