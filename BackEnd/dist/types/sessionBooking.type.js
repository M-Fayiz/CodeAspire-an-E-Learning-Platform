"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudenStatus = exports.BookingStatus = exports.bookingType = void 0;
var bookingType;
(function (bookingType) {
    bookingType["FREE"] = "free";
    bookingType["PAID"] = "paid";
})(bookingType || (exports.bookingType = bookingType = {}));
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["BOOKED"] = "booked";
    BookingStatus["COMPLETED"] = "completed";
    BookingStatus["PENDING"] = "Pending";
    BookingStatus["CANCELLED"] = "cancelled";
    BookingStatus["REFUNDED"] = "refunded";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var StudenStatus;
(function (StudenStatus) {
    StudenStatus["PASSED"] = "passed";
    StudenStatus["FAILED"] = "failed";
    StudenStatus["PENDING"] = "Pending";
})(StudenStatus || (exports.StudenStatus = StudenStatus = {}));
