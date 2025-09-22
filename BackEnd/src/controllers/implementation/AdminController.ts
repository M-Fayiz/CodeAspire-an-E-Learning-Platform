import { Request, Response, NextFunction } from "express";
import { IAdminController } from "../interface/IAdminController";
import { IAdminService } from "../../services/interface/IAdminService";
import { HttpStatus } from "../../const/http-status";
import { successResponse } from "../../utility/response.util";
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
      const user_ID = req.params.id;

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
      const { id } = req.params;

      const userData = await this._adminService.userProfile(id);

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
      const { id } = req.params;
      const result = await this._adminService.approveMentor(id);
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { result }));
    } catch (error) {
      next(error);
    }
  };
}
