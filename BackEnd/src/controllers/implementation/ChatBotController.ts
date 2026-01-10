import { Request, Response, NextFunction } from "express";
import { IChatbotController } from "../interface/IChatBotController";
import { IChatbotService } from "../../services/interface/IChatbotService";


export class ChatbotController implements IChatbotController{

    constructor(private _chatbotService:IChatbotService){}

    chat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log(req.body);

    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({ message: "prompt is required" });
      return;
    }

    const promptResult = await this._chatbotService.createChat(prompt);

    console.log("prompt result:", promptResult);

    res.status(200).json({
      reply: promptResult,
    });
  } catch (error) {
    next(error);
  }
};
}