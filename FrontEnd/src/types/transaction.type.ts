
export interface ITransactionDTO{
    _id:string,
    date:Date
    paymentTypes:TransactionType
    amount:number,
    share:number,
    mentorShare?:number
    status:TransactionStatus
}

export const ITransactionStatus ={
  SUCCESS : "success",
  FAILED : "failed",
  REFUNDED : "refunded",
} as const
export const TransactionType= {
  COURSE_PURCHASE : "COURSE_PURCHASE",
  SLOT_BOOKING : "SLOT_BOOKING",
} as const

export const TransactionStatus= {
  SUCCESS : "success",
  FAILED : "failed",
  REFUNDED : "refunded",
} as const

export const PaymentMethod= {
  STRIPE : "stripe",
  WALLET : "wallet",
} as const
export type TransactionType =
  typeof TransactionType[keyof typeof TransactionType];

export type TransactionStatus =
  typeof TransactionStatus[keyof typeof TransactionStatus];

export type PaymentMethod =
  typeof PaymentMethod[keyof typeof PaymentMethod];
