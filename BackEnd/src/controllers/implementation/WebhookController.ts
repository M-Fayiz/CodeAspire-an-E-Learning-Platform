import { Request, Response, NextFunction } from "express";
import { IWebhookController } from "../interface/IWebhookController";
import { IWebhookService } from "../../services/interface/IWebhookService";
import { HttpStatus } from "../../const/http-status.const";

export class WebhookController implements IWebhookController {
  constructor(private _webhookService: IWebhookService) {}

  handleStripeWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this._webhookService.processEvent(req);
      res.status(HttpStatus.OK).json({ received: true });
    } catch (error) {
      next(error);
    }
  };
}
