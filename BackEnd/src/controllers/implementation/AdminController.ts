import { Request,Response,NextFunction } from "express";
import { IAdminController } from "../interface/IAdminController";
import { IUserModel } from "../../Models/userModel";
import { AdminService } from "../../services/implementation/AdminService";
import { HttpStatus } from "../../const/http-status";
import { successResponse } from "../../utility/response.util";
import { HttpResponse } from "../../const/error-message";
export class AdminController implements IAdminController{

    constructor(private adminService:AdminService){}
    fetchAllUsers=async(req: Request, res: Response, next: NextFunction): Promise<void>=> {
        try {
            const allUsers=await this.adminService.fetchAllUsers()
            res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK,{allUsers}))
            
        } catch (error) {
            next(error)
        }
    }
    blockUser=async(req: Request, res: Response, next: NextFunction): Promise<void>=> {
         try {
            const user_ID=req.params.id
             const result=await this.adminService.blockUser(user_ID)
             res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK,{result}))
         } catch (error) {
            next(error)
         }
    }
}