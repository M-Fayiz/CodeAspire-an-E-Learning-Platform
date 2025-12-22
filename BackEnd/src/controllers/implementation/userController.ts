import { Request, Response, NextFunction } from "express";
import { IUserService } from "../../services/interface/IUserService";
import { IUserController } from "../interface/IUserController";
import { HttpStatus } from "../../const/http-status.const";
import { successResponse } from "../../utils/response.util";
import { HttpResponse } from "../../const/error-message.const";

import { sendNotification } from "../../utils/socket.utils";

export class UserController implements IUserController {
  constructor(private _userService: IUserService) {}

  fetchProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { userId } = req.params;
      // logger.info('user logged controler',{id})
      const userData = await this._userService.fetchUser(userId);

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
      const { userId } = req.params;

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
      const { userId } = req.params;

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
      const { userId } = req.params;
      const updatedData = await this._userService.updateUserProfile(
        userId,
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
      const { userId } = req.params;
      const userData = await this._userService.getUserProfile(userId);
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { userData }));
    } catch (error) {
      next(error);
    }
  };
  addMentorData = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { mentorId } = req.params;
      const userData = req.body;
      console.log("user data :", req.body);
      const mentorDataAndNotify = await this._userService.addMentorData(
        mentorId,
        userData,
      );

      sendNotification(
        mentorDataAndNotify.notificationDTO.userId,
        mentorDataAndNotify.notificationDTO,
      );

      res.status(HttpStatus.OK).json(
        successResponse(HttpResponse.OK, {
          mentorData: mentorDataAndNotify.MentorDtp,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
}
