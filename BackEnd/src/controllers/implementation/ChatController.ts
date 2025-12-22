import { Request, Response, NextFunction } from "express";
import { IChatController } from "../interface/IChatController";
import { IChatService } from "../../services/interface/IChatService";
import { HttpStatusCode } from "axios";
import { HttpResponse } from "../../const/error-message.const";
import { successResponse } from "../../utils/response.util";

export class ChatCOntroller implements IChatController {
  constructor(private _chatService: IChatService) {}

  getOrCreateChat = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { senderId, receiverId } = req.body;
      const chatData = await this._chatService.getOrCreateRoom(
        senderId,
        receiverId,
      );
      res
        .status(HttpStatusCode.Ok)
        .json(successResponse(HttpResponse.OK, { chatData }));
    } catch (error) {
      next(error);
    }
  };
  listUsers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { senderId } = req.params;

      const ChatUser = await this._chatService.listUsers(senderId);

      res
        .status(HttpStatusCode.Ok)
        .json(successResponse(HttpResponse.OK, { ChatUser }));
    } catch (error) {
      next(error);
    }
  };
  getChatMessages = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { chatId } = req.params;
      const { limit } = req.query;

      const messages = await this._chatService.getMessages(
        chatId,
        Number(limit),
      );
      res
        .status(HttpStatusCode.Ok)
        .json(successResponse(HttpResponse.OK, { messages }));
    } catch (error) {
      next(error);
    }
  };
}
