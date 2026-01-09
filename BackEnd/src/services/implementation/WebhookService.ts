import { Request } from "express";
import { IWebhookService } from "../interface/IWebhookService";
import Stripe from "stripe";
import { env } from "../../config/env.config";
import { IOrderService } from "../interface/IOrderService";
import { ISlotBookingService } from "../interface/ISlotBookingService";
import { stripe } from "../../config/stripe.config";
import { createHttpError } from "../../utils/http-error";
import { HttpStatus } from "../../const/http-status.const";
import { HttpResponse } from "../../const/error-message.const";
import { TransactionType } from "../../const/transaction.const";
export class WebhookService implements IWebhookService {
  constructor(
    private _orderService: IOrderService,
    private _slotBookingService: ISlotBookingService,
  ) {}
  async processEvent(req: Request): Promise<void> {
    const sig = req.headers["stripe-signature"];
    let event;
    if (!stripe) {
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.STRIPR_NOT_AVAILABLE,
      );
    }

    try {
      event = stripe.webhooks.constructEvent(
        req.body as Buffer,
        sig as string,
        env.WEB_HOOK_SECRETE_KEY as string,
      );

      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata;

      if (event.type === "checkout.session.completed") {
        switch (metadata?.paymentType) {
          case TransactionType.COURSE_PURCHASE:
            await this._orderService.handleCoursePurchase(session);
            break;

          case TransactionType.SLOT_BOOKING:
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
