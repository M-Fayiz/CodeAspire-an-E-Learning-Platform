import express from "express";
import { SlotRepository } from "../repository/implementation/SlotRepository";
import { SlotService } from "../services/implementation/SlotService";
import { SlotController } from "../controllers/implementation/SlotController";
import { SlotBookingRepository } from "../repository/implementation/SlotBookingRepositoy";
import { CourseRepository } from "../repository/implementation/CourseRepository";
const slotRouter = express.Router();

const slotRepository = new SlotRepository();
const slotBookingRepository = new SlotBookingRepository();
const courseRepositoy = new CourseRepository();
const slotService = new SlotService(
  slotRepository,
  slotBookingRepository,
  courseRepositoy,
);
const slotController = new SlotController(slotService);

slotRouter.post("/create", slotController.createSlot);
slotRouter.get("/:mentorId", slotController.getMentorSlots);
slotRouter.get("/course/:courseId", slotController.getCourseSlot);
slotRouter.put("/:slotId", slotController.updateSlot);

export default slotRouter;
