import { ISlotBooking } from "../../types/sessionBooking.type";

export interface ISlotBookingService {
  createBooking(bookingData: ISlotBooking): Promise<string | null>;
}
