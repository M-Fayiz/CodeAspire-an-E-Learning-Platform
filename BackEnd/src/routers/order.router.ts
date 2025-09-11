import express from "express";
const orderRouter = express.Router();

import { OrderRepositoy } from "../repository/implementation/OrderRepository";
import { OrderController } from "../controllers/implementation/OrderController";
import { OrderService } from "../services/implementation/OrderService";
import { CourseRepository } from "../repository/implementation/CourseRepository";
import { EnrolledRepository } from "../repository/implementation/EnrolledRepository";

const orderRepository = new OrderRepositoy();
const courseRepository = new CourseRepository();
const enrolledRepository = new EnrolledRepository();
const orderService = new OrderService(
  orderRepository,
  courseRepository,
  enrolledRepository,
);
const orderController = new OrderController(orderService);

orderRouter.post(
  "/payment/create-checkout-session",
  orderController.create_intent,
);

const webhookRouter = express.Router();
webhookRouter.post("/payment", orderController.paymentWebhok);

export { webhookRouter, orderRouter };
