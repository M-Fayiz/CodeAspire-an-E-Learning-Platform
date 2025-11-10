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
