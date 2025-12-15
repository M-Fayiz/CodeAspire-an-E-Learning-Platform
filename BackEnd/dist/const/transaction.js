"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethod = exports.TransactionStatus = exports.TransactionType = void 0;
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
