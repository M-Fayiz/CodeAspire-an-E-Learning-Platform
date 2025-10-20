import { Request, Response, NextFunction } from "express";

export interface IOrderController {
  paymentWebhok(req: Request, res: Response, next: NextFunction): Promise<void>;
  create_intent(req: Request, res: Response, next: NextFunction): Promise<void>;
  get_payment_data(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}
