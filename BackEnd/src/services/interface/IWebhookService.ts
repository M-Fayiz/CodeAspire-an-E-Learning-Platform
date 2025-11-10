import { Request } from "express";

export interface IWebhookService {
  processEvent(req: Request): Promise<void>;
}
