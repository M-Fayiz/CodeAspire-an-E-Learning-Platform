"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const http_status_1 = require("../../const/http-status");
class WebhookController {
    constructor(_webhookService) {
        this._webhookService = _webhookService;
        this.handleStripeWebhook = async (req, res, next) => {
            try {
                await this._webhookService.processEvent(req);
                res.status(http_status_1.HttpStatus.OK).json({ received: true });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.WebhookController = WebhookController;
