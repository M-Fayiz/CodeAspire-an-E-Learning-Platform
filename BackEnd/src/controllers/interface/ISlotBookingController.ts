import { NextFunction, Response, Request } from "express";

export interface ISlotBookingController {
  createBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
  listBookedSlot(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  listBookedSlotOnMentor(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  addFeedBack(req: Request, res: Response, next: NextFunction): Promise<void>;
  getBookedSlots(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  updateStudentStatus(req: Request,
    res: Response,
    next: NextFunction): Promise<void>;
    updateSlotStatus(req: Request,
    res: Response,
    next: NextFunction): Promise<void>;
}
