import { Request } from "express";
import { IOrderRepository } from "../../repository/interface/IOrderRepository";
import { IOrderService } from "../interface/IOrderService";
import Stripe from "stripe";
import { env } from "../../config/env.config";
import { createHttpError } from "../../utility/http-error";
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
import { courseDTO } from "../../dtos/course.dtos";
import { calculateShares } from "../../utility/calculateSplit.util";

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
      switch (event.type) {
        case "checkout.session.completed": {
          const pi = event.data.object;
          const orderId = pi.metadata?.orderId;
          const order_id = parseObjectId(orderId as string);
          if (!order_id) {
            throw createHttpError(
              HttpStatus.NOT_FOUND,
              HttpResponse.INVALID_ID,
            );
          }
          const order = await this._orderRepository.findOrder(order_id);
          if (!order) {
            throw createHttpError(HttpStatus.NOT_FOUND, "Order not found");
          }

          await this._orderRepository.updateOrderStatus(order_id, "completed");
          const course_id = parseObjectId(pi.metadata?.courseId as string);
          const user_id = parseObjectId(pi.metadata?.userId as string);
          const mentore_id = parseObjectId(pi.metadata?.mentorId as string);
          const category_id=parseObjectId(pi.metadata?.categoryId as string)
          if (!course_id || !user_id || !mentore_id||!category_id) {
            throw createHttpError(HttpStatus.OK, HttpResponse.OK);
          }
          const adminShare = calculateShares(
            Number(pi.metadata?.amount),
            Number(env.ADMIN_SHARE),
          );
          const mentorShare = calculateShares(
            Number(pi.metadata?.amount),
            Number(env.MENTOR_SHARE),
          );

          const transactionData: ITransaction = {
            amount: Number(pi.metadata?.amount),
            orderId: order_id,
            userId: user_id,
            mentorId:mentore_id,
            status: "success",
            paymentMethod: "stripe",
            gatewayTransactionId: pi.payment_intent as string,
            adminShare,
            mentorShare,
            courseId: course_id,
          };

          await this._transactionRepository.createTransaction(transactionData);

          const enrollData: IEnrollement = {
            courseId: course_id,
            categoryId:category_id ,
            learnerId: user_id,
            mentorId: mentore_id,
            progress: {
              completedLectures: [],
              completionPercentage: 0,
              lastAccessedLecture: null,
            },
          };

          await this._enrolledRepository.enrolleCourse(enrollData);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      }
      throw createHttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "Something went wrong!",
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
        success_url: `${env.CLIENT_ORGIN}/courses/payment-success/`,
        client_reference_id: String(orderData._id),
        metadata: {
          orderId,
          courseId,
          userId,
          amount,
          mentorId: String(course.mentorsId._id),
          categoryId:String(course.categoryId)
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
}
