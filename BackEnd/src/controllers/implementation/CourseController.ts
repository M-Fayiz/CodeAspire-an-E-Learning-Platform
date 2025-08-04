import { Request, Response, NextFunction } from "express";
import { ICourseService } from "../../services/interface/ICourseService";
import { ICourseCategory } from "../interface/ICourseController";
import { HttpStatus } from "../../const/http-status";
import { successResponse } from "../../utility/response.util";
import { HttpResponse } from "../../const/error-message";

export class CourseController implements ICourseCategory{
    constructor(private _courseService:ICourseService){}
    
    addCourse =async (req: Request, res: Response, next: NextFunction): Promise<void>=> { 
        try {
            console.log(req.body.courseData)
            
            const createdCourseData=await this._courseService.createCourses(req.body.courseData)
            res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK,{createdCourseData}))
        } catch (error) {
            next(error)
        }
    }
    updateCourse = async (req: Request, res: Response, next: NextFunction): Promise<void>=> {
        try {
            console.log(req.params.id,' 😶‍🌫️ 😶‍🌫️ ',req.body)
        } catch (error) {
            next()
        }
    }
}