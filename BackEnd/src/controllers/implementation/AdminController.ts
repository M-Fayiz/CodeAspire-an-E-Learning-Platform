import { Request,Response,NextFunction } from "express";
import { IAdminController } from "../interface/IAdminController";
import { IUserModel } from "../../Models/userModel";
import { AdminService } from "../../services/implementation/AdminService";
import { HttpStatus } from "../../const/http-status";
import { successResponse } from "../../utility/response.util";
import { HttpResponse } from "../../const/error-message";
import { log } from "console";
import { boolean } from "zod";
export class AdminController implements IAdminController{

    constructor(private adminService:AdminService){}
    fetchAllUsers=async(req: Request, res: Response, next: NextFunction): Promise<void>=> {
        try {
            
            const page = Number(req.query.page) || 1;
            const name = (req.query.name as string) || '';
            const role = (req.query.role as string) || '';
            const rawIsActive= (req.query.isActive as string)||'';
            const isActive: boolean | '' = rawIsActive === 'true'? true : rawIsActive === 'false'? false: '';
            
            const allUsers=await this.adminService.fetchAllUsers(Number(page),isActive,name,role)
            res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK,{users:allUsers.safeUsers,totalPage:allUsers.totalPage}))
            
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

    userProfile=async(req: Request, res: Response, next: NextFunction): Promise<void>=>{
        try {
            const {id}=req.params
            const userData=await this.adminService.userProfile(id)
           
            
            res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK,{userData}))
        } catch (error) {
            next()
        }
    }
}