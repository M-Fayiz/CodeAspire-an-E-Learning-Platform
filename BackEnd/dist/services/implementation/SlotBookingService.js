"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotBookingService = void 0;
const env_config_1 = require("../../config/env.config");
const error_message_const_1 = require("../../const/error-message.const");
const http_status_const_1 = require("../../const/http-status.const");
const sessionBooking_type_1 = require("../../types/sessionBooking.type");
const http_error_1 = require("../../utils/http-error");
const timeAndDateGenerator_1 = require("../../utils/timeAndDateGenerator");
const objectId_1 = require("../../mongoose/objectId");
const transaction_const_1 = require("../../const/transaction.const");
const calculateSplit_util_1 = require("../../utils/calculateSplit.util");
const slotBooking_dto_1 = require("../../dtos/slotBooking.dto");
const notification_template_1 = require("../../template/notification.template");
const stripe_config_1 = require("../../config/stripe.config");
const refundPercentage_util_1 = require("../../utils/refundPercentage.util");
const notification_dto_1 = require("../../dtos/notification.dto");
class SlotBookingService {
    constructor(_slotBookingRepository, _slotRepository, _transactionRepostiory, _notificationRepository) {
        this._slotBookingRepository = _slotBookingRepository;
        this._slotRepository = _slotRepository;
        this._transactionRepostiory = _transactionRepostiory;
        this._notificationRepository = _notificationRepository;
    }
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
    async createBooking(bookingData) {
        const { learnerId, courseId } = bookingData;
        const { date, startTime, endTime } = (0, timeAndDateGenerator_1.timeAndDateGenerator)(bookingData.date, bookingData.startTime, bookingData.endTime);
        const isAlreadyBooked = await this._slotBookingRepository.findSlots({
            mentorId: bookingData.mentorId,
            startTime: { $lt: endTime },
            endTime: { $gt: startTime },
        });
        if (isAlreadyBooked) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.CONFLICT, error_message_const_1.HttpResponse.SLOT_ALREADY_BOOKED);
        }
        const activeBooking = await this._slotBookingRepository.findSlots({
            learnerId,
            courseId,
            status: { $in: [sessionBooking_type_1.BookingStatus.BOOKED, sessionBooking_type_1.BookingStatus.PENDING] },
        });
        if (activeBooking) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.CONFLICT, error_message_const_1.HttpResponse.BOOKING_EXIST);
        }
        const previousBookings = await this._slotBookingRepository.findAllSlots({
            learnerId,
            courseId,
        });
        const isFreeBooking = previousBookings && previousBookings.length == 0;
        bookingData.type = isFreeBooking ? sessionBooking_type_1.bookingType.FREE : sessionBooking_type_1.bookingType.PAID;
        bookingData.date = date;
        bookingData.startTime = startTime;
        bookingData.endTime = endTime;
        const overlap = await this._slotBookingRepository.findSlots({
            learnerId,
            startTime: { $lt: endTime },
            endTime: { $gt: startTime },
            status: { $ne: sessionBooking_type_1.BookingStatus.COMPLETED },
        });
        if (overlap) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.CONFLICT, error_message_const_1.HttpResponse.BOOKING_TIME_CONFLICT);
        }
        if (bookingData.type == sessionBooking_type_1.bookingType.FREE) {
            await this._slotBookingRepository.createBooking({
                ...bookingData,
                status: sessionBooking_type_1.BookingStatus.BOOKED,
            });
            return null;
        }
        if (!stripe_config_1.stripe) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.INTERNAL_SERVER_ERROR, error_message_const_1.HttpResponse.STRIPR_NOT_AVAILABLE);
        }
        const mentorSlot = await this._slotRepository.findSlotByFilter({
            _id: bookingData.slotId,
        });
        if (!mentorSlot) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.ITEM_NOT_FOUND);
        }
        const createdPaidSlot = await this._slotBookingRepository.createBooking(bookingData);
        const session = await stripe_config_1.stripe.checkout.sessions.create({
            payment_method_types: [transaction_const_1.StripeConst.payment_method_types],
            mode: transaction_const_1.StripeConst.MODE,
            line_items: [
                {
                    price_data: {
                        currency: transaction_const_1.StripeConst.CURRENCY,
                        product_data: {
                            name: `Mentor Review Session`,
                        },
                        unit_amount: mentorSlot?.pricePerSlot * 100,
                    },
                    quantity: 1,
                },
            ],
            success_url: `${env_config_1.env.CLIENT_ORGIN}/courses/payment-success`,
            cancel_url: `${env_config_1.env.CLIENT_ORGIN}/slot-booking/cancel`,
            metadata: {
                paymentType: transaction_const_1.TransactionType.SLOT_BOOKING,
                bookingId: createdPaidSlot._id.toString(),
                learnerId: learnerId.toString(),
                courseId: courseId.toString(),
                slotId: bookingData.slotId.toString(),
                mentorId: mentorSlot.mentorId.toString(),
                amount: mentorSlot.pricePerSlot,
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
    async handleSlotBooking(session) {
        const { slotId, courseId, learnerId, mentorId, amount, bookingId } = session.metadata;
        const slot_id = (0, objectId_1.parseObjectId)(slotId);
        const learner_id = (0, objectId_1.parseObjectId)(learnerId);
        const mentor_id = (0, objectId_1.parseObjectId)(mentorId);
        const course_id = (0, objectId_1.parseObjectId)(courseId);
        if (!slot_id || !learner_id || !mentor_id || !course_id) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.INVALID_ID);
        }
        await this._slotBookingRepository.updateSlotBookingData({ _id: bookingId }, { status: sessionBooking_type_1.BookingStatus.BOOKED });
        const adminShare = (0, calculateSplit_util_1.calculateShares)(Number(amount), Number(env_config_1.env.ADMIN_SHARE));
        const mentorShare = (0, calculateSplit_util_1.calculateShares)(Number(amount), Number(env_config_1.env.MENTOR_SHARE));
        const paymentIntentId = typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id;
        const transactionData = {
            paymentType: transaction_const_1.TransactionType.SLOT_BOOKING,
            amount: Number(amount),
            userId: learner_id,
            mentorId: mentor_id,
            status: transaction_const_1.TransactionStatus.SUCCESS,
            paymentMethod: transaction_const_1.PaymentMethod.STRIPE,
            gatewayTransactionId: paymentIntentId,
            adminShare,
            mentorShare,
            courseId: course_id,
            slotId: slot_id,
        };
        await this._transactionRepostiory.createTransaction(transactionData);
    }
    async findBookedSlot(bookedId) {
        const booked_id = (0, objectId_1.parseObjectId)(bookedId);
        if (!booked_id) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.INVALID_ID);
        }
        const bookedData = await this._slotBookingRepository.findSlots({
            _id: booked_id,
        });
        if (!bookedData) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.NO_BOOKED_SLOT);
        }
        const now = new Date();
        const startTime = new Date(bookedData.startTime);
        const endTime = new Date(bookedData.endTime);
        const EARLY_JOIN_BUFFER = Number(env_config_1.env.EARLY_JOIN_BUFFER) * 60 * 1000;
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
        const notifyDataMentor = notification_template_1.NotificationTemplates.JoinNowSession(bookedData.mentorId);
        const notifyDataLerner = notification_template_1.NotificationTemplates.JoinNowSession(bookedData.learnerId);
        const createdMentorNotify = await this._notificationRepository.createNotification(notifyDataMentor);
        const createdLearnerNotify = await this._notificationRepository.createNotification(notifyDataLerner);
        return {
            sesionData: (0, slotBooking_dto_1.videoSessionDTO)(bookedData),
            createdMentorNotify,
            createdLearnerNotify,
        };
    }
    async ListLearnerBookedSlots(learnerId, mentorId, page) {
        let limit = 8;
        let skip = page ? (page - 1) * limit : 0;
        if (!learnerId && !mentorId) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.INVALID_ID);
        }
        let query = {};
        if (learnerId) {
            query.learnerId = learnerId;
        }
        else {
            query.mentorId = mentorId;
        }
        const bookedListss = await this._slotBookingRepository.listbookedSlots(query, limit, skip);
        return bookedListss.map((slot) => (0, slotBooking_dto_1.ListBookedSlotOfLearner)(slot));
    }
    async addFeedback(bookedId, feedBack) {
        const booked_id = (0, objectId_1.parseObjectId)(bookedId);
        if (!booked_id) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.INVALID_ID);
        }
        const updatedData = await this._slotBookingRepository.updateSlotBookingData({ _id: booked_id }, { feedback: feedBack });
        if (!updatedData) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.INTERNAL_SERVER_ERROR, error_message_const_1.HttpResponse.SERVER_ERROR);
        }
        return {
            feedback: updatedData.feedback,
            bookedId: updatedData._id,
        };
    }
    async getBookedSlots(date) {
        const slots = await this._slotBookingRepository.findAllSlots({});
        if (!slots) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.NO_BOOKED_SLOT);
        }
        return slots?.map((slot) => slot._id);
    }
    async updateStudents(bookedId, status) {
        const booked_Id = (0, objectId_1.parseObjectId)(bookedId);
        if (!booked_Id) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.INVALID_ID);
        }
        const updatedData = await this._slotBookingRepository.updateSlotBookingData({ _id: bookedId }, { studentStatus: status });
        if (!updatedData) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.ITEM_NOT_FOUND);
        }
        return {
            bookedId: updatedData?._id,
            status: updatedData?.studentStatus,
        };
    }
    async updateSlotStatus(bookedId, status) {
        const booked_Id = (0, objectId_1.parseObjectId)(bookedId);
        if (!booked_Id) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.INVALID_ID);
        }
        const updatedData = await this._slotBookingRepository.updateSlotBookingData({ _id: booked_Id }, { status: status });
        if (!updatedData) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.ITEM_NOT_FOUND);
        }
        return {
            bookedId: updatedData._id,
            status: updatedData.status,
        };
    }
    async cancelSlot(bookedId) {
        const booked_Id = (0, objectId_1.parseObjectId)(bookedId);
        const bookedSlot = await this._slotBookingRepository.findSlots({ _id: booked_Id });
        if (!bookedSlot) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.SLOT_NOT_FOUND);
        }
        if (bookedSlot.status !== sessionBooking_type_1.BookingStatus.BOOKED) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.CONFLICT, error_message_const_1.HttpResponse.CAN_NOT_CANCEL);
        }
        const now = new Date();
        const slotStart = new Date(bookedSlot.startTime);
        if (slotStart.getTime() <= now.getTime()) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.CONFLICT, error_message_const_1.HttpResponse.CAN_NOT_CANCEL);
        }
        const refundPercentage = (0, refundPercentage_util_1.getRefundPercentage)(bookedSlot.startTime);
        if (refundPercentage === 0) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.BAD_REQUEST, error_message_const_1.HttpResponse.TIME_EXCEEDED);
        }
        let cancelledData;
        if (bookedSlot.type === sessionBooking_type_1.bookingType.FREE) {
            bookedSlot.status = sessionBooking_type_1.BookingStatus.CANCELLED;
            cancelledData = await this._slotBookingRepository.updateSlotBookingData({ _id: booked_Id }, { status: sessionBooking_type_1.BookingStatus.CANCELLED });
            if (!cancelledData) {
                throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.INTERNAL_SERVER_ERROR, error_message_const_1.HttpResponse.SERVER_ERROR);
            }
            const notification = notification_template_1.NotificationTemplates.SlotCancellation(bookedSlot.learnerId, slotStart.getDate().toLocaleString());
            const createdNotification = await this._notificationRepository.createNotification(notification);
            return { status: cancelledData.status, notification: (0, notification_dto_1.notificationDto)(createdNotification) };
        }
        const transaction = await this._transactionRepostiory.findTransaction({ slotBookingId: booked_Id, status: transaction_const_1.TransactionStatus.SUCCESS });
        if (!transaction) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.TRANSACTION_NOT_FOUND);
        }
        if (!stripe_config_1.stripe) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.INTERNAL_SERVER_ERROR, error_message_const_1.HttpResponse.SERVER_ERROR);
        }
        const refundAmount = Math.floor((transaction.amount * refundPercentage) / 100);
        await stripe_config_1.stripe.refunds.create({
            payment_intent: transaction.gatewayTransactionId,
            amount: refundAmount * 100,
        });
        await this._transactionRepostiory.updateTransaction(transaction._id, { $set: { status: transaction_const_1.TransactionStatus.REFUNDED } });
        let slotStatus = refundPercentage === 100 ? sessionBooking_type_1.BookingStatus.REFUNDED : sessionBooking_type_1.BookingStatus.CANCELLED;
        const updateSlot = await this._slotBookingRepository.updateSlotBookingData({ _id: booked_Id }, { $set: { status: slotStatus } });
        if (!updateSlot) {
            throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.INTERNAL_SERVER_ERROR, error_message_const_1.HttpResponse.SERVER_ERROR);
        }
        const notification = notification_template_1.NotificationTemplates.SlotCancellation(transaction.userId, slotStart.toLocaleString());
        const createdNotification = await this._notificationRepository.createNotification(notification);
        return { status: updateSlot.status, notification: (0, notification_dto_1.notificationDto)(createdNotification) };
    }
}
exports.SlotBookingService = SlotBookingService;
