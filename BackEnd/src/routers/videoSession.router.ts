import express from "express";
const videoSessionRouter = express.Router();

import { VideoSessionController } from "../controllers/implementation/VideoSessionController";
import { SlotBookingService } from "../services/implementation/SlotBookingService";
import { SlotBookingRepository } from "../repository/implementation/SlotBookingRepositoy";
import { SlotRepository } from "../repository/implementation/SlotRepository";
import { TransactionRepositoy } from "../repository/implementation/TransactionRepository";
import { NotificationRepository } from "../repository/implementation/NotificationRepository";
const notificationRepository = new NotificationRepository();
const slotbookingRepository = new SlotBookingRepository();
const slotRepository = new SlotRepository();
const transactionRepository = new TransactionRepositoy();
const slotbookingService = new SlotBookingService(
  slotbookingRepository,
  slotRepository,
  transactionRepository,
  notificationRepository,
);
const videoSessionController = new VideoSessionController(slotbookingService);

videoSessionRouter.get(
  "/start/:bookedId",
  videoSessionController.startVideoSession,
);

export default videoSessionRouter;
