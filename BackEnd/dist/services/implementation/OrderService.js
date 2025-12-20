"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const env_config_1 = require("../../config/env.config");
const http_error_1 = require("../../utils/http-error");
const http_status_1 = require("../../const/http-status");
const objectId_1 = require("../../mongoose/objectId");
const error_message_1 = require("../../const/error-message");
const enrollment_types_1 = require("../../types/enrollment.types");
const logger_config_1 = __importDefault(require("../../config/logger.config"));
const calculateSplit_util_1 = require("../../utils/calculateSplit.util");
const transaction_1 = require("../../const/transaction");
const stripe_config_1 = require("../../config/stripe.config");
class OrderService {
    constructor(_orderRepository, _courseRepository, _enrolledRepository, _transactionRepository) {
        this._orderRepository = _orderRepository;
        this._courseRepository = _courseRepository;
        this._enrolledRepository = _enrolledRepository;
        this._transactionRepository = _transactionRepository;
    }
    /**
     * Handles a course purchase event triggered by the Stripe webhook.
     *
     * 1. Validates and extracts metadata from the Stripe session.
     * 2. Verifies the order and updates its status.
     * 3. Calculates and splits payment shares for admin and mentor.
     * 4. Creates a transaction record.
     * 5. Enrolls the learner into the purchased course.
     * @param session
     * @returns
     */
    async handleCoursePurchase(session) {
        const metadata = session.metadata;
        const { orderId, courseId, userId, mentorId, categoryId, amount } = metadata;
        const order_id = (0, objectId_1.parseObjectId)(orderId);
        const course_id = (0, objectId_1.parseObjectId)(courseId);
        const user_id = (0, objectId_1.parseObjectId)(userId);
        const mentore_id = (0, objectId_1.parseObjectId)(mentorId);
        const category_id = (0, objectId_1.parseObjectId)(categoryId);
        if (!order_id || !course_id || !user_id || !mentore_id || !category_id) {
            logger_config_1.default.error(" Invalid ObjectIds in metadata:", session.metadata);
            return;
        }
        const order = await this._orderRepository.findOrder(order_id);
        if (!order) {
            logger_config_1.default.error("Order not found:", order_id);
            return;
        }
        if (order.status === transaction_1.OrderStatus.COMPLETED) {
            logger_config_1.default.warn("Order already completed. Skipping:", order_id);
            return;
        }
        await this._orderRepository.updateOrderStatus(order_id, transaction_1.OrderStatus.COMPLETED);
        const adminShare = (0, calculateSplit_util_1.calculateShares)(Number(amount), Number(env_config_1.env.ADMIN_SHARE));
        const mentorShare = (0, calculateSplit_util_1.calculateShares)(Number(amount), Number(env_config_1.env.MENTOR_SHARE));
        const paymentIntentId = typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id;
        const transactionData = {
            paymentType: transaction_1.TransactionType.COURSE_PURCHASE,
            amount: Number(amount),
            orderId: order_id,
            userId: user_id,
            mentorId: mentore_id,
            status: transaction_1.TransactionStatus.SUCCESS,
            paymentMethod: "stripe",
            gatewayTransactionId: paymentIntentId,
            adminShare,
            mentorShare,
            courseId: course_id,
        };
        await this._transactionRepository.createTransaction(transactionData);
        const enrollData = {
            courseId: course_id,
            categoryId: category_id,
            learnerId: user_id,
            mentorId: mentore_id,
            progress: {
                completedLectures: [],
                completionPercentage: 0,
                lastAccessedLecture: null,
                lastAccessedSession: null
            },
            courseStatus: enrollment_types_1.completionStatus.IN_PROGRESS
        };
        await this._enrolledRepository.enrolleCourse(enrollData);
    }
    /**
     *
     * @param userId
     * @param courseId
     * @returns
     */
    async paymentIntent(userId, courseId) {
        const course_id = (0, objectId_1.parseObjectId)(courseId);
        const user_Id = (0, objectId_1.parseObjectId)(userId);
        if (!course_id || !user_Id) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.NOT_FOUND, error_message_1.HttpResponse.INVALID_ID);
        }
        const isEnrolled = await this._enrolledRepository.isEnrolled(user_Id, course_id);
        if (isEnrolled) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.CONFLICT, error_message_1.HttpResponse.ORDER_EXIST);
        }
        const course = await this._courseRepository.findCourse(course_id);
        if (!course) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.NOT_FOUND, "Course Not FOund");
        }
        const amount = course.price;
        const order = {
            userId: user_Id,
            courseId: course_id,
            totalAmount: amount,
            status: "pending",
        };
        const orderData = await this._orderRepository.createOrder(order);
        if (!orderData) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.INTERNAL_SERVER_ERROR, error_message_1.HttpResponse.SERVER_ERROR);
        }
        const orderId = String(orderData._id);
        const idemKey = `order_${orderData._id}`;
        if (!stripe_config_1.stripe) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.INTERNAL_SERVER_ERROR, error_message_1.HttpResponse.STRIPR_NOT_AVAILABLE);
        }
        const session = await stripe_config_1.stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: course.title,
                            metadata: {
                                courseId: String(course._id),
                            },
                        },
                        unit_amount: course.price * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${env_config_1.env.CLIENT_URL_2}/courses/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            client_reference_id: String(orderData._id),
            metadata: {
                paymentType: transaction_1.TransactionType.COURSE_PURCHASE,
                orderId,
                courseId,
                userId,
                amount,
                mentorId: String(course.mentorId._id),
                categoryId: String(course.categoryId._id),
            },
        }, { idempotencyKey: idemKey });
        await this._orderRepository.updateOrder(orderData._id, {
            paymentIntentId: session.id,
        });
        return {
            clientSecret: session.client_secret,
            orderId: String(orderData._id),
            checkoutURL: session.url,
        };
    }
    async getPaymentData(sessionId) {
        console.log("session Id  :", sessionId);
        if (!stripe_config_1.stripe) {
            throw (0, http_error_1.createHttpError)(http_status_1.HttpStatus.INTERNAL_SERVER_ERROR, error_message_1.HttpResponse.STRIPR_NOT_AVAILABLE);
        }
        const session = await stripe_config_1.stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["payment_intent", "invoice"],
        });
        return session;
    }
}
exports.OrderService = OrderService;
