import Stripe from "stripe";
import { ISlotBooking } from "../../types/sessionBooking.type";

export interface ISlotBookingService {
  createBooking(bookingData: ISlotBooking): Promise<string | null>;
  handleSlotBooking(session: Stripe.Checkout.Session): Promise<void>;
}
