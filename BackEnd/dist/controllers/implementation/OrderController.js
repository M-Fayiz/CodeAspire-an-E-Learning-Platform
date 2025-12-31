"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const http_status_const_1 = require("../../const/http-status.const");
const error_message_const_1 = require("../../const/error-message.const");
const response_util_1 = require("../../utils/response.util");
class OrderController {
    constructor(_orderService) {
        this._orderService = _orderService;
        this.create_intent = async (req, res, next) => {
            try {
                const { userId, courseId } = req.body;
                const { clientSecret, orderId, checkoutURL } = await this._orderService.paymentIntent(userId, courseId);
                res.status(http_status_const_1.HttpStatus.OK).json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, {
                    clientSecret,
                    orderId,
                    checkoutURL,
                }));
            }
            catch (error) {
                next(error);
            }
        };
        this.get_payment_data = async (req, res, next) => {
            try {
                const { id } = req.params;
                const paymentdata = await this._orderService.getPaymentData(id);
                res
                    .status(http_status_const_1.HttpStatus.OK)
                    .json((0, response_util_1.successResponse)(error_message_const_1.HttpResponse.OK, { paymentdata }));
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.OrderController = OrderController;
