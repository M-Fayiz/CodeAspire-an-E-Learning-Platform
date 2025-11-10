import express from "express";
import { SlotRepository } from "../repository/implementation/SlotRepository";
import { SlotService } from "../services/implementation/SlotService";
import { SlotController } from "../controllers/implementation/SlotController";
const slotRouter = express.Router();

const slotRepository = new SlotRepository();
const slotService = new SlotService(slotRepository);
const slotController = new SlotController(slotService);

slotRouter.post("/create", slotController.createSlot);
slotRouter.get("/:mentorId", slotController.getMentorSlots);
slotRouter.get("/course/:courseId", slotController.getCourseSlot);
slotRouter.put("/:slotId", slotController.updateSlot);

export default slotRouter;
