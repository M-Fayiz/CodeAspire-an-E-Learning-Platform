export enum TransactionType {
  COURSE_PURCHASE = "COURSE_PURCHASE",
  SLOT_BOOKING = "SLOT_BOOKING",
}

export enum TransactionStatus {
  SUCCESS = "success",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum PaymentMethod {
  STRIPE = "stripe",
  WALLET = "wallet",
}

export enum OrderStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum StripeConst {
  MODE = "payment",
  CURRENCY = "inr",
  SUCCESS_URL = "courses/payment-success?session_id={CHECKOUT_SESSION_ID}",
  payment_intent = "payment_intent",
  iNVOICE = "invoice",
  payment_method_types = "card",
}
