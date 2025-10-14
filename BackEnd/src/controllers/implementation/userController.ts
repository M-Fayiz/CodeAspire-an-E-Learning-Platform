import { Request, Response, NextFunction } from "express";
import { IUserService } from "../../services/interface/IUserService";
import { IUserController } from "../interface/IUserController";
import { HttpStatus } from "../../const/http-status";
import { successResponse } from "../../utils/response.util";
import { HttpResponse } from "../../const/error-message";
import logger from "../../config/logger.config";

export class UserController implements IUserController {
  constructor(private _userService: IUserService) {}

  fetchProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      // logger.info('user logged controler',{id})
      const userData = await this._userService.fetchUser(id);

      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { userData }));
    } catch (error) {
      next(error);
    }
  };
  changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.params.id;

      await this._userService.changePassword(
        userId,
        currentPassword,
        newPassword,
      );
      res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK));
    } catch (error) {
      next(error);
    }
  };

  updateProfileImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { imageURL } = req.body;
      const userId = req.params.id;

      const ImageSavedUrl = await this._userService.userProfilePitcureUpdate(
        imageURL,
        userId,
      );
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { imgURL: ImageSavedUrl }));
    } catch (error) {
      next(error);
    }
  };
  updateUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedData = await this._userService.updateUserProfile(
        id,
        req.body,
      );
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { updatedData: updatedData }));
    } catch (error) {
      next(error);
    }
  };
  getUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userData = await this._userService.getUserProfile(id);
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { userData }));
    } catch (error) {
      next(error);
    }
  };
}
