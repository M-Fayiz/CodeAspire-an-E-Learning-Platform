import Stripe from "stripe";
import { env } from "../../config/env.config";
import { HttpResponse } from "../../const/error-message";
import { HttpStatus } from "../../const/http-status";
import { ISlotBookingRepository } from "../../repository/interface/ISlotBookingRepository";
import { ISlotBooking } from "../../types/sessionBooking.type";
import { createHttpError } from "../../utils/http-error";
import { timeAndDateGenerator } from "../../utils/timeAndDateGenerator";
import { ISlotBookingService } from "../interface/ISlotBookingService";
import { ISlotRepository } from "../../repository/interface/ISlotRepository";

export class SlotBookingService implements ISlotBookingService {
  private _stripe;

  constructor(
    private _slotBookingRepository: ISlotBookingRepository,
    private _slotRepository: ISlotRepository,
  ) {
    this._stripe = new Stripe(env.STRIPE_SECRETE_KEY as string);
  }

  async createBooking(bookingData: ISlotBooking): Promise<string | null> {
    
    const { learnerId, courseId } = bookingData;

    const activeBooking = await this._slotBookingRepository.findSlots({
      learnerId,
      courseId,
      status: { $in: ["booked", "Pending"] },
    });

    if (activeBooking) {
      throw createHttpError(HttpStatus.CONFLICT, HttpResponse.BOOKING_EXIST);
    }

    const previousBookings = await this._slotBookingRepository.findAllSlots({
      learnerId,
      courseId,
    });

    const isFreeBooking = previousBookings && previousBookings.length == 0;

    bookingData.type = isFreeBooking ? "free" : "paid";

    const { date, startTime, endTime } = timeAndDateGenerator(
      bookingData.date as string,
      bookingData.startTime as string,
      bookingData.endTime as string,
    );

    bookingData.date = date;
    bookingData.startTime = startTime;
    bookingData.endTime = endTime;

    const overlap = await this._slotBookingRepository.findSlots({
      learnerId,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });

    if (overlap) {
      throw createHttpError(
        HttpStatus.CONFLICT,
        HttpResponse.BOOKING_TIME_CONFLICT,
      );
    }

    if (bookingData.type == "free") {
      await this._slotBookingRepository.createBooking(bookingData);
      return null;
    }

    const mentorSlot = await this._slotRepository.findSlotByFilter({
      _id: bookingData.slotId,
    });
    if (!mentorSlot) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.ITEM_NOT_FOUND,
      );
    }
    const session = await this._stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Mentor Review Session`,
            },
            unit_amount: (mentorSlot?.pricePerSlot as number) * 100,
          },
          quantity: 1,
        },
      ],
      success_url: `${env.CLIENT_ORGIN}/courses/payment-success`,
      cancel_url: `${env.CLIENT_ORGIN}/slot-booking/cancel`,
      metadata: {
        type: "slot_booking",
        learnerId: learnerId.toString(),
        courseId: courseId.toString(),
        slotId: bookingData.slotId.toString(),
        mentorId: mentorSlot.mentorId.toString(),
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        amount: mentorSlot.pricePerSlot as number,
      },
    });

    return session.url;
  }
}
