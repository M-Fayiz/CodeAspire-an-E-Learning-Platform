import { Request } from "express";
import { IWebhookService } from "../interface/IWebhookService";
import Stripe from "stripe";
import { env } from "../../config/env.config";
import { IOrderService } from "../interface/IOrderService";
import { ISlotBookingService } from "../interface/ISlotBookingService";

export class WebhookService implements IWebhookService {
  private _stripe;
  constructor(
    private _orderService: IOrderService,
    private _slotBookingService: ISlotBookingService,
  ) {
    this._stripe = new Stripe(env.STRIPE_SECRETE_KEY as string);
  }
  async processEvent(req: Request): Promise<void> {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = this._stripe.webhooks.constructEvent(
        req.body as Buffer,
        sig as string,
        env.WEB_HOOK_SECRETE_KEY as string,
      );

      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata;

      if (event.type === "checkout.session.completed") {
        switch (metadata?.paymentType) {
          case "COURSE_PURCHASE":
            await this._orderService.handleCoursePurchase(session);
            break;
          case "SLOT_BOOKING":
            await this._slotBookingService.handleSlotBooking(session);
            break;
          default:
            console.warn("Unknown payment type:", metadata?.paymentType);
        }
      }
    } catch (error) {
      console.error("Stripe webhook error:", error);
      throw error;
    }
  }
}
