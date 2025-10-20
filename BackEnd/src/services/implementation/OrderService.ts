import { Request } from "express";
import { IOrderRepository } from "../../repository/interface/IOrderRepository";
import { IOrderService } from "../interface/IOrderService";
import Stripe from "stripe";
import { env } from "../../config/env.config";
import { createHttpError } from "../../utils/http-error";
import { HttpStatus } from "../../const/http-status";
import { parseObjectId } from "../../mongoose/objectId";
import { HttpResponse } from "../../const/error-message";
import { ICourseRepository } from "../../repository/interface/ICourseRepository";
import { IOrder } from "../../types/order.type";
import { IEnrolledRepository } from "../../repository/interface/IEnrolledRepositoy";
import { IEnrollement } from "../../types/enrollment.types";
import logger from "../../config/logger.config";
import { ITransactionRepository } from "../../repository/interface/ITransactionRepository";
import { ITransaction } from "../../types/transaction.type";
import { calculateShares } from "../../utils/calculateSplit.util";
import { Types } from "mongoose";

export class OrderService implements IOrderService {
  private _stripe;
  constructor(
    private _orderRepository: IOrderRepository,
    private _courseRepository: ICourseRepository,
    private _enrolledRepository: IEnrolledRepository,
    private _transactionRepository: ITransactionRepository,
  ) {
    this._stripe = new Stripe(env.STRIPE_SECRETE_KEY as string);
  }

  async processEvent(req: Request): Promise<void> {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = this._stripe.webhooks.constructEvent(
        req.body as Buffer,
        sig as string,
        env.WEB_HOOK_SECRETE_KEY as string,
      );

      logger.info(` Stripe event received: ${event.type}`);

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        if (!session.metadata) {
          logger.error(" Missing metadata in session:", session.id);
          return;
        }

        const { orderId, courseId, userId, mentorId, categoryId, amount } =
          session.metadata;
        const order_id = parseObjectId(orderId);
        const course_id = parseObjectId(courseId);
        const user_id = parseObjectId(userId);
        const mentore_id = parseObjectId(mentorId);
        const category_id = parseObjectId(categoryId);

        if (
          !order_id ||
          !course_id ||
          !user_id ||
          !mentore_id ||
          !category_id
        ) {
          logger.error(" Invalid ObjectIds in metadata:", session.metadata);
          return;
        }

        const order = await this._orderRepository.findOrder(order_id);
        if (!order) {
          logger.error(" Order not found:", order_id);
          return;
        }

        await this._orderRepository.updateOrderStatus(order_id, "completed");

        const adminShare = calculateShares(
          Number(amount),
          Number(env.ADMIN_SHARE),
        );
        const mentorShare = calculateShares(
          Number(amount),
          Number(env.MENTOR_SHARE),
        );

        const paymentIntentId =
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id;

        const transactionData: ITransaction = {
          amount: Number(amount),
          orderId: order_id,
          userId: user_id,
          mentorId: mentore_id,
          status: "success",
          paymentMethod: "stripe",
          gatewayTransactionId: paymentIntentId as string,
          adminShare,
          mentorShare,
          courseId: course_id,
        };

        logger.info("✅ Creating transaction:", transactionData);
        await this._transactionRepository.createTransaction(transactionData);

        const enrollData: IEnrollement = {
          courseId: course_id,
          categoryId: category_id,
          learnerId: user_id,
          mentorId: mentore_id,
          progress: {
            completedLectures: [],
            completionPercentage: 0,
            lastAccessedLecture: null,
          },
        };

        logger.info("✅ Enrolling learner:", enrollData);
        await this._enrolledRepository.enrolleCourse(enrollData);

        logger.info(
          "🎉 Enrollment and transaction completed for order:",
          order_id,
        );
      }
    } catch (error) {
      logger.error("❌ Stripe webhook error:", error);
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.SERVER_ERROR,
      );
    }
  }

  async paymentIntent(
    userId: string,
    courseId: string,
  ): Promise<{ clientSecret: string; orderId: string; checkoutURL: string }> {
    const course_id = parseObjectId(courseId);
    const user_Id = parseObjectId(userId);
    if (!course_id || !user_Id) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.INVALID_ID);
    }

    const isEnrolled = await this._enrolledRepository.isEnrolled(
      user_Id,
      course_id,
    );

    if (isEnrolled) {
      throw createHttpError(HttpStatus.CONFLICT, HttpResponse.ORDER_EXIST);
    }
    const course = await this._courseRepository.findCourse(course_id);

    if (!course) {
      throw createHttpError(HttpStatus.NOT_FOUND, "Course Not FOund");
    }
    const amount = course.price;

    const order: IOrder = {
      userId: user_Id,
      courseId: course_id,
      totalAmount: amount,
      status: "pending",
    };

    const orderData = await this._orderRepository.createOrder(order);
    if (!orderData) {
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        HttpResponse.SERVER_ERROR,
      );
    }
    const orderId = String(orderData._id);
    const idemKey = `order_${orderData._id}`;

    const session = await this._stripe.checkout.sessions.create(
      {
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: course.title,
                metadata: {
                  courseId: String(course._id) as string,
                },
              },
              unit_amount: course.price * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${env.CLIENT_ORGIN}/courses/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        client_reference_id: String(orderData._id),
        metadata: {
          orderId,
          courseId,
          userId,
          amount,
          mentorId: String(course.mentorsId._id),
          categoryId: String(course.categoryId._id),
        },
      },
      { idempotencyKey: idemKey },
    );

    await this._orderRepository.updateOrder(orderData._id, {
      paymentIntentId: session.id,
    });

    return {
      clientSecret: session.client_secret as string,
      orderId: String(orderData._id),
      checkoutURL: session.url as string,
    };
  }
  async getPaymentData(
    sessionId: string,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    console.log("session Id  :", sessionId);
    const session = await this._stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "invoice"],
    });
    console.log("session ", session);
    return session;
  }
}
