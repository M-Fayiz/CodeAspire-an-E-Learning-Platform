import { Request, Response, NextFunction } from "express";
import { IChatController } from "../interface/IChatController";
import { IChatService } from "../../services/interface/IChatService";


export class ChatCOntroller implements IChatController{
    constructor(private _chatService:IChatService){}

    getOrCreateChat=async(req: Request, res: Response, next: NextFunction): Promise<void>=>{
        try {
          const {userId1,userId2}=req.body
          await this._chatService.getOrCreateRoom(userId1,userId2)  
        } catch (error) {
            next(error)
        }
    }

}