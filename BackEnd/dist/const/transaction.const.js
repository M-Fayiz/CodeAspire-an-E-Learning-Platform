"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeConst = exports.OrderStatus = exports.PaymentMethod = exports.TransactionStatus = exports.TransactionType = void 0;
var TransactionType;
(function (TransactionType) {
    TransactionType["COURSE_PURCHASE"] = "COURSE_PURCHASE";
    TransactionType["SLOT_BOOKING"] = "SLOT_BOOKING";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["SUCCESS"] = "success";
    TransactionStatus["FAILED"] = "failed";
    TransactionStatus["REFUNDED"] = "refunded";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["STRIPE"] = "stripe";
    PaymentMethod["WALLET"] = "wallet";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "pending";
    OrderStatus["COMPLETED"] = "completed";
    OrderStatus["FAILED"] = "failed";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var StripeConst;
(function (StripeConst) {
    StripeConst["MODE"] = "payment";
    StripeConst["CURRENCY"] = "inr";
    StripeConst["SUCCESS_URL"] = "courses/payment-success?session_id={CHECKOUT_SESSION_ID}";
    StripeConst["payment_intent"] = "payment_intent";
    StripeConst["iNVOICE"] = "invoice";
    StripeConst["payment_method_types"] = "card";
})(StripeConst || (exports.StripeConst = StripeConst = {}));
