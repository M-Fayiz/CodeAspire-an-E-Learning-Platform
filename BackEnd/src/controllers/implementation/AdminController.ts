import { Request, Response, NextFunction } from "express";
import { IAdminController } from "../interface/IAdminController";
import { IAdminService } from "../../services/interface/IAdminService";
import { HttpStatus } from "../../const/http-status";
import { successResponse } from "../../utils/response.util";
import { HttpResponse } from "../../const/error-message";

export class AdminController implements IAdminController {
  constructor(private _adminService: IAdminService) {}

  fetchAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const name = (req.query.name as string) || "";
      const role = (req.query.role as string) || "";
      const rawIsActive = (req.query.isActive as string) || "";
      const isActive: boolean | "" =
        rawIsActive === "true" ? true : rawIsActive === "false" ? false : "";

      const allUsers = await this._adminService.fetchAllUsers(
        Number(page),
        isActive,
        name,
        role,
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
      const { status } = req.body;
      const approveStatus = await this._adminService.approveMentor(
        userId,
        status,
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
}
