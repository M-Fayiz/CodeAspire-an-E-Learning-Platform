import Stripe from "stripe";
import { env } from "../../config/env.config";
import { HttpResponse } from "../../const/error-message.const";
import { HttpStatus } from "../../const/http-status.const";
import { ISlotBookingRepository } from "../../repository/interface/ISlotBookingRepository";
import {
  BookingStatus,
  bookingType,
  ISlotBooking,
  StudenStatus,
} from "../../types/sessionBooking.type";
import { createHttpError } from "../../utils/http-error";
import { timeAndDateGenerator } from "../../utils/timeAndDateGenerator";
import { ISlotBookingService } from "../interface/ISlotBookingService";
import { ISlotRepository } from "../../repository/interface/ISlotRepository";
import { parseObjectId } from "../../mongoose/objectId";
import { ITransaction } from "../../types/transaction.type";
import { PaymentMethod, StripeConst, TransactionStatus, TransactionType } from "../../const/transaction.const";
import { calculateShares } from "../../utils/calculateSplit.util";
import { ITransactionRepository } from "../../repository/interface/ITransactionRepository";
import {
  IBookingDTOforLearner,
  IVideoSessionDTO,
} from "../../types/dtos.type/slotBooking.dto.type";
import {
  ListBookedSlotOfLearner,
  videoSessionDTO,
} from "../../dtos/slotBooking.dto";
import { FilterQuery, Types } from "mongoose";
import { ISlotBookingModel } from "../../models/sessionBooking.model";
import { INotificationRepository } from "../../repository/interface/INotificationRepository";
import { NotificationTemplates } from "../../template/notification.template";
import { INotificationDTO } from "../../types/dtos.type/notification.dto.types";
import { stripe } from "../../config/stripe.config";
import { getRefundPercentage } from "../../utils/refundPercentage.util";
import { notificationDto } from "../../dtos/notification.dto";






export class SlotBookingService implements ISlotBookingService {
  constructor(
    private _slotBookingRepository: ISlotBookingRepository,
    private _slotRepository: ISlotRepository,
    private _transactionRepostiory: ITransactionRepository,
    private _notificationRepository: INotificationRepository,
  ) {}
  /**
   * * Creates a new slot booking for a learner.
   *
   * Steps:
   * 1. Checks if an existing active booking exists (booked or pending).
   * 2. Determines whether the learner is eligible for a free booking.
   * 3. Normalizes date and time values.
   * 4. Validates that no time conflict exists with other bookings.
   * 5. If the booking is free, stores it directly.
   * 6. If paid, verifies mentor slot details and creates a Stripe Checkout Session.
   *
   * @param bookingData
   * @returns
   */
  async createBooking(bookingData: ISlotBooking): Promise<string | null> {
    const { learnerId, courseId } = bookingData;

    const { date, startTime, endTime } = timeAndDateGenerator(
      bookingData.date as string,
      bookingData.startTime as string,
      bookingData.endTime as string,
    );
    const isAlreadyBooked = await this._slotBookingRepository.findSlots({
      mentorId: bookingData.mentorId,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
    });
    if (isAlreadyBooked) {
      throw createHttpError(HttpStatus.CONFLICT, HttpResponse.SLOT_ALREADY_BOOKED);
    }

  
    const activeBooking = await this._slotBookingRepository.findSlots({
      learnerId,
      courseId,
      status: { $in: [BookingStatus.BOOKED, BookingStatus.PENDING] },
    });

    if (activeBooking) {
      throw createHttpError(HttpStatus.CONFLICT, HttpResponse.BOOKING_EXIST);
    }

    const previousBookings = await this._slotBookingRepository.findAllSlots({
      learnerId,
      courseId,
    });

    const isFreeBooking = previousBookings && previousBookings.length == 0;

    bookingData.type = isFreeBooking ? bookingType.FREE : bookingType.PAID;

    bookingData.date = date;
    bookingData.startTime = startTime;
    bookingData.endTime = endTime;

    const overlap = await this._slotBookingRepository.findSlots({
      learnerId,
      startTime: { $lt: endTime },
      endTime: { $gt: startTime },
      status: { $ne: BookingStatus.COMPLETED },
    });

    if (overlap) {
      throw createHttpError(
        HttpStatus.CONFLICT,
        HttpResponse.BOOKING_TIME_CONFLICT,
      );
    }

    if (bookingData.type == bookingType.FREE) {
      await this._slotBookingRepository.createBooking({
        ...bookingData,
        status: BookingStatus.BOOKED,
      });
      return null;
    }
    if (!stripe) {
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.STRIPR_NOT_AVAILABLE,
      );
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
    const createdPaidSlot =
      await this._slotBookingRepository.createBooking(bookingData);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: [StripeConst.payment_method_types],
      mode: StripeConst.MODE,
      line_items: [
        {
          price_data: {
            currency:StripeConst.CURRENCY,
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
        paymentType: TransactionType.SLOT_BOOKING,
        bookingId: createdPaidSlot._id.toString(),
        learnerId: learnerId.toString(),
        courseId: courseId.toString(),
        slotId: bookingData.slotId.toString(),
        mentorId: mentorSlot.mentorId.toString(),
        amount: mentorSlot.pricePerSlot as number,
      },
    });

    return session.url;
  }
  /**
   *  * Handles a slot booking event triggered by the Stripe webhook.
   *
   * 1. Validates and extracts metadata from the Stripe session.
   * 2.  updates booking  status.
   * 3. Calculates and splits payment shares for admin and mentor.
   * 4. Creates a transaction record.
   * 5.
   * @param session
   */
  async handleSlotBooking(session: Stripe.Checkout.Session): Promise<void> {
    const { slotId, courseId, learnerId, mentorId, amount, bookingId } =
      session.metadata!;

    const slot_id = parseObjectId(slotId);
    const learner_id = parseObjectId(learnerId);
    const mentor_id = parseObjectId(mentorId);
    const course_id = parseObjectId(courseId);

    if (!slot_id || !learner_id || !mentor_id || !course_id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }
    await this._slotBookingRepository.updateSlotBookingData(
      { _id: bookingId },
      { status: BookingStatus.BOOKED },
    );
    const adminShare = calculateShares(Number(amount), Number(env.ADMIN_SHARE));
    const mentorShare = calculateShares(
      Number(amount),
      Number(env.MENTOR_SHARE),
    );

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    const transactionData: ITransaction = {
      paymentType: TransactionType.SLOT_BOOKING,
      amount: Number(amount),
      userId: learner_id,
      mentorId: mentor_id,
      status: TransactionStatus.SUCCESS,
      paymentMethod: PaymentMethod.STRIPE,
      gatewayTransactionId: paymentIntentId as string,
      adminShare,
      mentorShare,
      courseId: course_id,
      slotId: slot_id,
    };
    await this._transactionRepostiory.createTransaction(transactionData);
  }

  async findBookedSlot(bookedId: string): Promise<{
    sesionData: IVideoSessionDTO;
    createdMentorNotify: INotificationDTO;
    createdLearnerNotify: INotificationDTO;
  }> {
    const booked_id = parseObjectId(bookedId);
    if (!booked_id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }

    const bookedData = await this._slotBookingRepository.findSlots({
      _id: booked_id,
    });

    if (!bookedData) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.NO_BOOKED_SLOT);
    }

    const now = new Date();
    const startTime = new Date(bookedData.startTime);
    const endTime = new Date(bookedData.endTime);

    const EARLY_JOIN_BUFFER = Number(env.EARLY_JOIN_BUFFER) * 60 * 1000;

    const currentDate = now.toISOString().split("T")[0];
    const sessionDate = new Date(bookedData.date).toISOString().split("T")[0];
    // if (currentDate !== sessionDate) {
    //   throw createHttpError(HttpStatus.CONFLICT, HttpResponse.SLOT_DATE);
    // }

    // if (now.getTime() < startTime.getTime() - EARLY_JOIN_BUFFER) {
    //   throw createHttpError(HttpStatus.CONFLICT, HttpResponse.NOT_STARTED);
    // }

    // if (now.getTime() > endTime.getTime()) {
    //   throw createHttpError(HttpStatus.CONFLICT, HttpResponse.SESSION_ENDED);
    // }
    const notifyDataMentor = NotificationTemplates.JoinNowSession(
      bookedData.mentorId,
    );
    const notifyDataLerner = NotificationTemplates.JoinNowSession(
      bookedData.learnerId,
    );

    const createdMentorNotify =
      await this._notificationRepository.createNotification(notifyDataMentor);
    const createdLearnerNotify =
      await this._notificationRepository.createNotification(notifyDataLerner);
    return {
      sesionData: videoSessionDTO(bookedData),
      createdMentorNotify,
      createdLearnerNotify,
    };
  }
  async ListLearnerBookedSlots(
    learnerId?: string,
    mentorId?: string,
    page?: number,
  ): Promise<IBookingDTOforLearner[]> {
    let limit = 8;

    let skip = page ? (page - 1) * limit : 0;
    if (!learnerId && !mentorId) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }
    let query: FilterQuery<ISlotBookingModel> = {};
    
    if (learnerId) {
      query.learnerId = learnerId;
    } else {
      query.mentorId = mentorId;
    }
  
    const bookedListss = await this._slotBookingRepository.listbookedSlots(
      query,
      limit,
      skip,
    );
   
    return bookedListss.map((slot) => ListBookedSlotOfLearner(slot));
  }
  async addFeedback(
    bookedId: string,
    feedBack: string,
  ): Promise<{ feedback: string; bookedId: Types.ObjectId }> {
    const booked_id = parseObjectId(bookedId);
    if (!booked_id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }

    const updatedData = await this._slotBookingRepository.updateSlotBookingData(
      { _id: booked_id },
      { feedback: feedBack },
    );

    if (!updatedData) {
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.SERVER_ERROR,
      );
    }

    return {
      feedback: updatedData.feedback as string,
      bookedId: updatedData._id,
    };
  }
  async getBookedSlots(date: Date): Promise<Types.ObjectId[]> {
    const slots = await this._slotBookingRepository.findAllSlots({});
    if (!slots) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.NO_BOOKED_SLOT);
    }
    return slots?.map((slot) => slot._id);
  }
  async updateStudents(
    bookedId: string,
    status: StudenStatus,
  ): Promise<{ bookedId: Types.ObjectId; status: StudenStatus }> {
    const booked_Id = parseObjectId(bookedId);
    if (!booked_Id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }

    const updatedData = await this._slotBookingRepository.updateSlotBookingData(
      { _id: bookedId },
      { studentStatus: status },
    );
    if (!updatedData) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.ITEM_NOT_FOUND,
      );
    }
    return {
      bookedId: updatedData?._id,
      status: updatedData?.studentStatus as StudenStatus,
    };
  }
  async updateSlotStatus(
    bookedId: string,
    status: BookingStatus,
  ): Promise<{ bookedId: Types.ObjectId; status: BookingStatus }> {
    const booked_Id = parseObjectId(bookedId);
    if (!booked_Id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }
    const updatedData = await this._slotBookingRepository.updateSlotBookingData(
      { _id: booked_Id },
      { status: status },
    );

    if (!updatedData) {
      throw createHttpError(
        HttpStatus.BAD_REQUEST,
        HttpResponse.ITEM_NOT_FOUND,
      );
    }
    return {
      bookedId: updatedData._id,
      status: updatedData.status as BookingStatus,
    };
  }
  async cancelSlot(bookedId: string): Promise<{status:BookingStatus,notification:INotificationDTO}> {
    const booked_Id=parseObjectId(bookedId)
    
    const bookedSlot= await this._slotBookingRepository.findSlots({_id:booked_Id})

    if(!bookedSlot){
      throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.SLOT_NOT_FOUND)
    }
    if(bookedSlot.status!==BookingStatus.BOOKED){
      throw createHttpError(HttpStatus.CONFLICT,HttpResponse.CAN_NOT_CANCEL)
    }
    const now = new Date();
    const slotStart = new Date(bookedSlot.startTime);

    if (slotStart.getTime() <= now.getTime()) {
      throw createHttpError(HttpStatus.CONFLICT,HttpResponse.CAN_NOT_CANCEL);
    }

   const refundPercentage = getRefundPercentage(bookedSlot.startTime);
      if (refundPercentage === 0) {
        throw createHttpError(
          HttpStatus.BAD_REQUEST,
          HttpResponse.TIME_EXCEEDED
        );
      }
  

    let cancelledData
    if (bookedSlot.type === bookingType.FREE) {
        bookedSlot.status = BookingStatus.CANCELLED;
       cancelledData= await this._slotBookingRepository.updateSlotBookingData({_id:booked_Id},{status:BookingStatus.CANCELLED})
       if(!cancelledData){
        throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR,HttpResponse.SERVER_ERROR)
       }
        const notification=NotificationTemplates.SlotCancellation(bookedSlot.learnerId,slotStart.getDate().toLocaleString())
         const createdNotification= await this._notificationRepository.createNotification(notification)
       return {status:cancelledData.status as unknown as BookingStatus,notification:notificationDto(createdNotification)}
      
    }
    const transaction = await this._transactionRepostiory.findTransaction({slotBookingId:booked_Id,status:TransactionStatus.SUCCESS})
    if(!transaction){
      throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.TRANSACTION_NOT_FOUND)
    }
    if(!stripe){
      throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR,HttpResponse.SERVER_ERROR)
    }

      const refundAmount = Math.floor((transaction.amount * refundPercentage) / 100);

    await stripe.refunds.create({
      payment_intent: transaction.gatewayTransactionId,
      amount: refundAmount * 100, 
    });


    await this._transactionRepostiory.updateTransaction(transaction._id,{$set:{status:TransactionStatus.REFUNDED}})

    let slotStatus=refundPercentage === 100? BookingStatus.REFUNDED : BookingStatus.CANCELLED;
    
    const updateSlot=await this._slotBookingRepository.updateSlotBookingData({_id:booked_Id},{$set:{status:slotStatus}})
    if(!updateSlot){
      throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR,HttpResponse.SERVER_ERROR)
    }

   const notification=NotificationTemplates.SlotCancellation(transaction.userId,slotStart.toLocaleString())
   const createdNotification= await this._notificationRepository.createNotification(notification)

    return {status:updateSlot.status as unknown as BookingStatus,notification:notificationDto(createdNotification)}
  }
}
