import { Request, Response, NextFunction } from "express";
import { ISlotBookingService } from "../../services/interface/ISlotBookingService";
import { ISlotBookingController } from "../interface/ISlotBookingController";
import { ISlotBooking } from "../../types/sessionBooking.type";
import { HttpStatus } from "../../const/http-status";
import { HttpResponse } from "../../const/error-message";
import { successResponse } from "../../utils/response.util";

export class SlotBookingController implements ISlotBookingController {
  constructor(private _slotBookingService: ISlotBookingService) {}

  createBooking = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const {
        learnerId,
        slotId,
        date,
        courseId,
        startTime,
        endTime,
        mentorId,
      } = req.body;

      const bookingData: ISlotBooking = {
        mentorId,
        learnerId,
        courseId,
        slotId,
        date,
        startTime,
        endTime,
      };

      console.log(bookingData);

      const checkoutURL =
        await this._slotBookingService.createBooking(bookingData);

      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { checkoutURL }));
    } catch (error) {
      next(error);
    }
  };
  listBookedSlot = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { learnerId } = req.params;

      const listsOfBooked =
        await this._slotBookingService.ListLearnerBookedSlots(learnerId);

      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { listsOfBooked }));
    } catch (error) {
      next(error);
    }
  };
  listBookedSlotOnMentor = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { mentorId } = req.params;

      const listsOfBooked =
        await this._slotBookingService.ListLearnerBookedSlots("", mentorId);

      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { listsOfBooked }));
    } catch (error) {
      next(error);
    }
  };
  addFeedBack = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { bookedId } = req.params;
      const { feedback } = req.body;

      const updatedFeedback = await this._slotBookingService.addFeedback(
        bookedId,
        feedback,
      );
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { updatedFeedback }));
    } catch (error) {
      next(error);
    }
  };
  getBookedSlots = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const date = new Date();
      const bookedSlots = await this._slotBookingService.getBookedSlots(date);

      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { bookedSlots }));
    } catch (error) {
      next(error);
    }
  };
  updateStudentStatus=async(req: Request, res: Response, next: NextFunction): Promise<void>=>{
    try {
      const {bookedId}=req.params
      const {studentStatus}=req.body
      console.log(bookedId,'  -          -',studentStatus)
      const updatedData=await this._slotBookingService.updateStudents(bookedId,studentStatus)
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { updatedData }));
    } catch (error) {
      next(error)
    }
    
  }
  updateSlotStatus=async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
      const {bookedId}=req.params
      const {status}=req.body
      const updateStatus=await this._slotBookingService.updateSlotStatus(bookedId,status)
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { updateStatus }));
    } catch (error) {
      next(error)
    }
  }
}
