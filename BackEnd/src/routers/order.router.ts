import express from "express";
const orderRouter = express.Router();

import { OrderRepositoy } from "../repository/implementation/OrderRepository";
import { OrderController } from "../controllers/implementation/OrderController";
import { OrderService } from "../services/implementation/OrderService";
import { CourseRepository } from "../repository/implementation/CourseRepository";
import { EnrolledRepository } from "../repository/implementation/EnrolledRepository";
import { verifyUser } from "../middlewares/authentication.middleware";
import { authorizedRole } from "../middlewares/authorisation.middleware";
import { TransactionRepositoy } from "../repository/implementation/TransactionRepository";
const transactionRepository=new TransactionRepositoy()
const orderRepository = new OrderRepositoy();
const courseRepository = new CourseRepository();
const enrolledRepository = new EnrolledRepository();
const orderService = new OrderService(
  orderRepository,
  courseRepository,
  enrolledRepository,
  transactionRepository
);

const orderController = new OrderController(orderService);

orderRouter.post(
  "/payment/create-checkout-session",
  verifyUser,
  authorizedRole("learner"),
  orderController.create_intent,
);

const webhookRouter = express.Router();
webhookRouter.post(
  "/payment",
  verifyUser,
  authorizedRole("learner"),
  orderController.paymentWebhok,
);

export { webhookRouter, orderRouter };
