import { Request, Response, NextFunction } from "express";
import { IChatbotController } from "../interface/IChatBotController";
import { IChatbotService } from "../../services/interface/IChatbotService";


export class ChatbotController implements IChatbotController{

    constructor(private _chatbotService:IChatbotService){}

    chat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log(req.body);

    const { chatbotData,currentLecture,currentSession } = req.body;

    const promptResult = await this._chatbotService.createChat(chatbotData,currentSession,currentLecture);

    console.log("prompt result:", promptResult);

    res.status(200).json({
      reply: promptResult,
    });
  } catch (error) {
    next(error);
  }
};
}