import express from "express";

const bookingROuter = express.Router();
import { SlotBookingRepository } from "../repository/implementation/SlotBookingRepositoy";
import { SlotBookingService } from "../services/implementation/SlotBookingService";
import { SlotBookingController } from "../controllers/implementation/SlotBookingController";
import { SlotRepository } from "../repository/implementation/SlotRepository";
import { TransactionRepositoy } from "../repository/implementation/TransactionRepository";

const slotBookingRepository = new SlotBookingRepository();
const slotRepository = new SlotRepository();
const tansactionRepository = new TransactionRepositoy();
const slotBookingService = new SlotBookingService(
  slotBookingRepository,
  slotRepository,
  tansactionRepository,
);

const slotBookingController = new SlotBookingController(slotBookingService);
bookingROuter.put("/:bookedId", slotBookingController.addFeedBack);
bookingROuter.get("/learner/:learnerId", slotBookingController.listBookedSlot);
bookingROuter.get(
  "/mentor/:mentorId",
  slotBookingController.listBookedSlotOnMentor,
);
bookingROuter.post("/create", slotBookingController.createBooking);

export default bookingROuter;
