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
      const { learnerId, slotId, date, courseId, startTime, endTime } =
        req.body;

      const bookingData: ISlotBooking = {
        learnerId,
        courseId,
        slotId,
        date,
        startTime,
        endTime,
      };

      const checkoutURL =
        await this._slotBookingService.createBooking(bookingData);

      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { checkoutURL }));
    } catch (error) {
      next(error);
    }
  };
}
