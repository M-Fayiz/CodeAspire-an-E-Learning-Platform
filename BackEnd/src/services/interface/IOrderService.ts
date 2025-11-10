import Stripe from "stripe";
export interface IOrderService {
  paymentIntent(
    userId: string,
    courseId: string,
  ): Promise<{ clientSecret: string; orderId: string; checkoutURL: string }>;
  getPaymentData(
    sessionId: string,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>>;
  handleCoursePurchase(session: Stripe.Checkout.Session): Promise<void>;
}
