export type PaymentSuccessType = "COURSE" | "SLOT";

export interface PaymentSuccessData {
  paymentType: PaymentSuccessType;
  amount: number;
  invoiceId?: string;
  invoiceUrl?: string;
  paymentIntentId: string;
  createdAt: string;
}
