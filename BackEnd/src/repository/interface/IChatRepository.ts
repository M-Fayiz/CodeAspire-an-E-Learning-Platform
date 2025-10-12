import { IChatModel } from "../../models/chat.model";


export interface IChatRespository{
    createChat():Promise<IChatModel>
}