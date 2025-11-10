import express from "express";

const bookingROuter = express.Router();
import { SlotBookingRepository } from "../repository/implementation/SlotBookingRepositoy";
import { SlotBookingService } from "../services/implementation/SlotBookingService";
import { SlotBookingController } from "../controllers/implementation/SlotBookingController";
import { SlotRepository } from "../repository/implementation/SlotRepository";

const slotBookingRepository = new SlotBookingRepository();
const slotRepository = new SlotRepository();
const slotBookingService = new SlotBookingService(
  slotBookingRepository,
  slotRepository,
);
const slotBookingController = new SlotBookingController(slotBookingService);

bookingROuter.post("/create", slotBookingController.createBooking);

export default bookingROuter;
