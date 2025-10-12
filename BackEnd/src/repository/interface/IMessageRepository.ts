import { IMessageModel } from "../../models/message.model";


export interface IMessageRepository{
    createMessage():Promise<IMessageModel>
}