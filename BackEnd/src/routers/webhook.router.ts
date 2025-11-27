import express from "express";
const webhookRouter = express.Router();

import { WebhookController } from "../controllers/implementation/WebhookController";
import { WebhookService } from "../services/implementation/WebhookService";
import { OrderService } from "../services/implementation/OrderService";
import { SlotBookingService } from "../services/implementation/SlotBookingService";

//slot service Repository
import { SlotRepository } from "../repository/implementation/SlotRepository";
import { SlotBookingRepository } from "../repository/implementation/SlotBookingRepositoy";

const slotRepository = new SlotRepository();
const slotBookingRepository = new SlotBookingRepository();

// Order Servie Repository
import { OrderRepositoy } from "../repository/implementation/OrderRepository";
import { CourseRepository } from "../repository/implementation/CourseRepository";
import { EnrolledRepository } from "../repository/implementation/EnrolledRepository";
import { TransactionRepositoy } from "../repository/implementation/TransactionRepository";
import { NotificationRepository } from "../repository/implementation/NotificationRepository";

const orderRepositoy = new OrderRepositoy();
const courseRepositoy = new CourseRepository();
const enrolledRepositoy = new EnrolledRepository();
const transactionRepositoy = new TransactionRepositoy();
const notificationRepository=new NotificationRepository()

const ordreService = new OrderService(
  orderRepositoy,
  courseRepositoy,
  enrolledRepositoy,
  transactionRepositoy,
);
const slotBookingService = new SlotBookingService(
  slotBookingRepository,
  slotRepository,
  transactionRepositoy,
  notificationRepository
);
const webhookService = new WebhookService(ordreService, slotBookingService);
const webhookController = new WebhookController(webhookService);

webhookRouter.post("/payment", webhookController.handleStripeWebhook);

export default webhookRouter;
