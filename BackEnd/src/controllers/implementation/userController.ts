import { Request, Response, NextFunction } from "express";
import { IUserModel } from "../../Models/userModel";
import { IUserService } from "../../services/interface/IUserService";
import { IUserController } from "../interface/IUserController";
import { HttpStatus } from "../../const/http-status";
import { successResponse } from "../../utility/response.util";
import { HttpResponse } from "../../const/error-message";


export class UserController implements IUserController {
    constructor(private _userService: IUserService) {}

    fetchProfile= async(req: Request, res: Response, next: NextFunction): Promise<void>=>{
        try {
            const email=req.query.email as string
            const userData=await this._userService.fetchUser(email)
           res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK,{userData}))
        } catch (error) {
            next(error);
        }
    }
    changePassword= async(req: Request, res: Response, next: NextFunction): Promise<void>=> {
        try {
            const{currentPassword,newPassword}=req.body
            const userId=req.params.id
            
            await this._userService.changePassword(userId,currentPassword,newPassword)
            res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK))
        } catch (error) {
            next(error)
        }
    }
}
