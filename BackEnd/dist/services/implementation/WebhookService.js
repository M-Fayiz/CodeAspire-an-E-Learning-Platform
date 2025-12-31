"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookService = void 0;
const env_config_1 = require("../../config/env.config");
const stripe_config_1 = require("../../config/stripe.config");
const http_error_1 = require("../../utils/http-error");
const http_status_const_1 = require("../../const/http-status.const");
const error_message_const_1 = require("../../const/error-message.const");
const transaction_const_1 = require("../../const/transaction.const");
class WebhookService {
    constructor(_orderService, _slotBookingService) {
        this._orderService = _orderService;
        this._slotBookingService = _slotBookingService;
    }
    async processEvent(req) {
        const sig = req.headers["stripe-signature"];
        let event;
        if (!stripe_config_1.stripe) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.INTERNAL_SERVER_ERROR, error_message_const_1.HttpResponse.STRIPR_NOT_AVAILABLE);
        }
        try {
            event = stripe_config_1.stripe.webhooks.constructEvent(req.body, sig, env_config_1.env.WEB_HOOK_SECRETE_KEY);
            const session = event.data.object;
            const metadata = session.metadata;
            if (event.type === "checkout.session.completed") {
                switch (metadata?.paymentType) {
                    case transaction_const_1.TransactionType.COURSE_PURCHASE:
                        await this._orderService.handleCoursePurchase(session);
                        break;
                    case transaction_const_1.TransactionType.SLOT_BOOKING:
                        await this._slotBookingService.handleSlotBooking(session);
                        break;
                    default:
                        console.warn("Unknown payment type:", metadata?.paymentType);
                }
            }
        }
        catch (error) {
            console.error("Stripe webhook error:", error);
            throw error;
        }
    }
}
exports.WebhookService = WebhookService;
