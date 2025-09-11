import { Request } from "express";
export interface IOrderService {
  processEvent(req: Request): Promise<void>;
  paymentIntent(
    userId: string,
    courseId: string,
  ): Promise<{ clientSecret: string; orderId: string; checkoutURL: string }>;
}
