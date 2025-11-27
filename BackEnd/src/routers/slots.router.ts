import express from "express";
import { SlotRepository } from "../repository/implementation/SlotRepository";
import { SlotService } from "../services/implementation/SlotService";
import { SlotController } from "../controllers/implementation/SlotController";
import { SlotBookingRepository } from "../repository/implementation/SlotBookingRepositoy";
const slotRouter = express.Router();

const slotRepository = new SlotRepository();
const slotBookingRepository=new SlotBookingRepository()
const slotService = new SlotService(slotRepository,slotBookingRepository);
const slotController = new SlotController(slotService);

slotRouter.post("/create", slotController.createSlot);
slotRouter.get("/:mentorId", slotController.getMentorSlots);
slotRouter.get("/course/:courseId", slotController.getCourseSlot);
slotRouter.put("/:slotId", slotController.updateSlot);

export default slotRouter;
