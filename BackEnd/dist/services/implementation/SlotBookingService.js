"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotBookingService = void 0;
const env_config_1 = require("../../config/env.config");
const error_message_1 = require("../../const/error-message");
const http_status_1 = require("../../const/http-status");
const http_error_1 = require("../../utils/http-error");
const timeAndDateGenerator_1 = require("../../utils/timeAndDateGenerator");
const objectId_1 = require("../../mongoose/objectId");
const transaction_1 = require("../../const/transaction");
const calculateSplit_util_1 = require("../../utils/calculateSplit.util");
const slotBooking_dto_1 = require("../../dtos/slotBooking.dto");
const notification_template_1 = require("../../template/notification.template");
const stripe_config_1 = require("../../config/stripe.config");
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
        const activeBooking = await this._slotBookingRepository.findSlots({
            learnerId,
            courseId,
            status: { $in: ["booked", "Pending"] },
        });
        if (activeBooking) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.CONFLICT, error_message_1.HttpResponse.BOOKING_EXIST);
        }
        const previousBookings = await this._slotBookingRepository.findAllSlots({
            learnerId,
            courseId,
        });
        const isFreeBooking = previousBookings && previousBookings.length == 0;
        bookingData.type = isFreeBooking ? "free" : "paid";
        const { date, startTime, endTime } = (0, timeAndDateGenerator_1.timeAndDateGenerator)(bookingData.date, bookingData.startTime, bookingData.endTime);
        bookingData.date = date;
        bookingData.startTime = startTime;
        bookingData.endTime = endTime;
        const overlap = await this._slotBookingRepository.findSlots({
            learnerId,
            startTime: { $lt: endTime },
            endTime: { $gt: startTime },
            status: { $ne: "completed" },
        });
        if (overlap) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.CONFLICT, error_message_1.HttpResponse.BOOKING_TIME_CONFLICT);
        }
        if (bookingData.type == "free") {
            await this._slotBookingRepository.createBooking({
                ...bookingData,
                status: "booked",
            });
            return null;
        }
        if (!stripe_config_1.stripe) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.INTERNAL_SERVER_ERROR, error_message_1.HttpResponse.STRIPR_NOT_AVAILABLE);
        }
        const mentorSlot = await this._slotRepository.findSlotByFilter({
            _id: bookingData.slotId,
        });
        if (!mentorSlot) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.BAD_REQUEST, error_message_1.HttpResponse.ITEM_NOT_FOUND);
        }
        const createdPaidSlot = await this._slotBookingRepository.createBooking(bookingData);
        const session = await stripe_config_1.stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "inr",
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
                paymentType: "SLOT_BOOKING",
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
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.BAD_REQUEST, error_message_1.HttpResponse.INVALID_ID);
        }
        await this._slotBookingRepository.updateSlotBookingData({ _id: bookingId }, { status: "booked" });
        const adminShare = (0, calculateSplit_util_1.calculateShares)(Number(amount), Number(env_config_1.env.ADMIN_SHARE));
        const mentorShare = (0, calculateSplit_util_1.calculateShares)(Number(amount), Number(env_config_1.env.MENTOR_SHARE));
        const paymentIntentId = typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id;
        const transactionData = {
            paymentType: transaction_1.TransactionType.SLOT_BOOKING,
            amount: Number(amount),
            userId: learner_id,
            mentorId: mentor_id,
            status: "success",
            paymentMethod: "stripe",
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
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.BAD_REQUEST, error_message_1.HttpResponse.INVALID_ID);
        }
        const bookedData = await this._slotBookingRepository.findSlots({
            _id: booked_id,
        });
        if (!bookedData) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.NOT_FOUND, error_message_1.HttpResponse.NO_BOOKED_SLOT);
        }
        const now = new Date();
        const startTime = new Date(bookedData.startTime);
        const endTime = new Date(bookedData.endTime);
        const EARLY_JOIN_BUFFER = Number(env_config_1.env.EARLY_JOIN_BUFFER) * 60 * 1000;
        const currentDate = now.toISOString().split("T")[0];
        const sessionDate = new Date(bookedData.date).toISOString().split("T")[0];
        if (currentDate !== sessionDate) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.CONFLICT, error_message_1.HttpResponse.SLOT_DATE);
        }
        if (now.getTime() < startTime.getTime() - EARLY_JOIN_BUFFER) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.CONFLICT, error_message_1.HttpResponse.NOT_STARTED);
        }
        if (now.getTime() > endTime.getTime()) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.CONFLICT, error_message_1.HttpResponse.SESSION_ENDED);
        }
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
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.BAD_REQUEST, error_message_1.HttpResponse.INVALID_ID);
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
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.BAD_REQUEST, error_message_1.HttpResponse.INVALID_ID);
        }
        const updatedData = await this._slotBookingRepository.updateSlotBookingData({ _id: booked_id }, { feedback: feedBack });
        if (!updatedData) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.INTERNAL_SERVER_ERROR, error_message_1.HttpResponse.SERVER_ERROR);
        }
        return {
            feedback: updatedData.feedback,
            bookedId: updatedData._id,
        };
    }
    async getBookedSlots(date) {
        const slots = await this._slotBookingRepository.findAllSlots({});
        if (!slots) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.NOT_FOUND, error_message_1.HttpResponse.NO_BOOKED_SLOT);
        }
        return slots?.map((slot) => slot._id);
    }
    async updateStudents(bookedId, status) {
        const booked_Id = (0, objectId_1.parseObjectId)(bookedId);
        if (!booked_Id) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.BAD_REQUEST, error_message_1.HttpResponse.INVALID_ID);
        }
        const updatedData = await this._slotBookingRepository.updateSlotBookingData({ _id: bookedId }, { studentStatus: status });
        if (!updatedData) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.BAD_REQUEST, error_message_1.HttpResponse.ITEM_NOT_FOUND);
        }
        return {
            bookedId: updatedData?._id,
            status: updatedData?.studentStatus
        };
    }
    async updateSlotStatus(bookedId, status) {
        const booked_Id = (0, objectId_1.parseObjectId)(bookedId);
        if (!booked_Id) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.BAD_REQUEST, error_message_1.HttpResponse.INVALID_ID);
        }
        const updatedData = await this._slotBookingRepository.updateSlotBookingData({ _id: booked_Id }, { status: status });
        if (!updatedData) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.BAD_REQUEST, error_message_1.HttpResponse.ITEM_NOT_FOUND);
        }
        return { bookedId: updatedData._id, status: updatedData.status };
    }
}
exports.SlotBookingService = SlotBookingService;
