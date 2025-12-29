import { Request, Response, NextFunction } from "express";
import { IAdminController } from "../interface/IAdminController";
import { IAdminService } from "../../services/interface/IAdminService";
import { HttpStatus } from "../../const/http-status.const";
import { successResponse } from "../../utils/response.util";
import { HttpResponse } from "../../const/error-message.const";
import { sendNotification } from "../../utils/socket.utils";
import { FilterByDate } from "../../const/filter.const";

export class AdminController implements IAdminController {
  constructor(private _adminService: IAdminService) {}

  fetchAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { page, search } = req.query;

      const allUsers = await this._adminService.fetchAllUsers(
        Number(page),
        search as string,
      );
      res.status(HttpStatus.OK).json(
        successResponse(HttpResponse.OK, {
          users: allUsers.safeUsers,
          totalPage: allUsers.totalPage,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
  /**
   *
   * @param req
   * @param res
   * @param next
   */
  blockUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user_ID = req.params.userId;

      const result = await this._adminService.blockUser(user_ID);
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { result }));
    } catch (error) {
      next(error);
    }
  };

  userProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      console.log("userID : ", userId);
      const userData = await this._adminService.userProfile(userId);

      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { userData }));
    } catch (error) {
      next(error);
    }
  };
  approveMentor = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      const { status, feedback } = req.body;
      const approveStatus = await this._adminService.approveMentor(
        userId,
        status,
        feedback,
      );
      sendNotification(
        approveStatus.notification.userId,
        approveStatus.notification,
      );
      res
        .status(HttpStatus.OK)
        .json(
          successResponse(HttpResponse.OK, { status: approveStatus.status }),
        );
    } catch (error) {
      next(error);
    }
  };
  getDashboardCardData = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { filter, startDate, endDate } = req.query;
      const dashBoardData = await this._adminService.getDashboardData(
        filter as FilterByDate,
        startDate as string,
        endDate as string,
      );
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { dashBoardData }));
    } catch (error) {
      next(error);
    }
  };
}
