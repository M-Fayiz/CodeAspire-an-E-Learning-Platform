import { Request } from "express";
import Stripe from "stripe";
export interface IOrderService {
  processEvent(req: Request): Promise<void>;
  paymentIntent(
    userId: string,
    courseId: string,
  ): Promise<{ clientSecret: string; orderId: string; checkoutURL: string }>;
  getPaymentData(
    sessionId: string,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>>;
}
