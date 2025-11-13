import { Request, Response, NextFunction } from "express";
import { ISlotBookingService } from "../../services/interface/ISlotBookingService";
import { IVideoSeesionController } from "../interface/IVideoSessionController";
import { HttpStatus } from "../../const/http-status";
import { HttpResponse } from "../../const/error-message";
import { successResponse } from "../../utils/response.util";

export class VideoSessionController implements IVideoSeesionController {
  constructor(private _slotBookingSevice: ISlotBookingService) {}

  startVideoSession = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { bookedId } = req.params;
      const videoSessionData =
        await this._slotBookingSevice.findBookedSlot(bookedId);

      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { videoSessionData }));
    } catch (error) {
      next(error);
    }
  };
}
