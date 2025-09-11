import { Request, Response, NextFunction } from "express";
import { IUserService } from "../../services/interface/IUserService";
import { IUserController } from "../interface/IUserController";
import { HttpStatus } from "../../const/http-status";
import { successResponse } from "../../utility/response.util";
import { HttpResponse } from "../../const/error-message";

export class UserController implements IUserController {
  constructor(private _userService: IUserService) {}

  fetchProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const email = req.query.email as string;
      const userData = await this._userService.fetchUser(email);
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

  preSignedURL = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { fileName, type } = req.query;
      console.log("filename ", fileName);
      const { uploadURL, fileURL } =
        await this._userService.generatePresignedUploadUrl(
          fileName as string,
          type as string,
        );
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { uploadURL, fileURL }));
    } catch (error) {
      next(error);
    }
  };

  get_preSignedURL = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { key } = req.query;
      console.log("key", key);

      const get_fileURL = await this._userService.generatePresignedGetUrl(
        key as string,
      );

      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { get_fileURL }));
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
