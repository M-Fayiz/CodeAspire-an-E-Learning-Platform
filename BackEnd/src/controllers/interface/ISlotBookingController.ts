import { NextFunction, Response, Request } from "express";

export interface ISlotBookingController {
  createBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
}
