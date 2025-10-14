import { IMessage } from "../../types/message.type";


export interface IMessageRepository{
    createMessage(data: Partial<IMessage>):Promise<IMessageModel>
}