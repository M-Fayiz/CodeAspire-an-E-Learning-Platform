import { Request, Response, NextFunction } from "express";
import { ICourseService } from "../../services/interface/ICourseService";
import { ICourseCategory } from "../interface/ICourseController";
import { HttpStatus } from "../../const/http-status";
import { successResponse } from "../../utility/response.util";
import { HttpResponse } from "../../const/error-message";
import { updatePart } from "../../types/courses.type";

export class CourseController implements ICourseCategory {
  constructor(private _courseService: ICourseService) {}

  addCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      console.log(req.body.courseData);

      const createdCourseData = await this._courseService.createCourses(
        req.body.courseData,
      );
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { createdCourseData }));
    } catch (error) {
      next(error);
    }
  };
  updateCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      let courseId = req.params.id;
      let updatedPart = req.query.course_part;
      let courseData = req.body;
      console.log(courseId, updatedPart, courseData);
      const updatedCourseData = await this._courseService.updateCourseData(
        courseId,
        courseData,
        updatedPart as updatePart,
      );
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { updatedCourseData }));
      console.log(updatedCourseData);
    } catch (error) {
      next(error);
    }
  };
  fetchCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    console.log("fetcourses");

    try {
      const courseListData = await this._courseService.fetchCourses();
      console.log(courseListData);

      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { courseListData }));
    } catch (error) {
      next(error);
    }
  };
  getCourse=async(req: Request, res: Response, next: NextFunction): Promise<void>=>{
      try {
        const courseId=req.params.id
        const course=await this._courseService.getCourse(courseId)
        res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK,{course}))
      } catch (error) {
        next(error)
      }
  }
  getMentorDraftedCourseList=async(req: Request, res: Response, next: NextFunction): Promise<void>=> {
      try {
        console.log('🔥🔥 kjdaij')
        const {mentorId}=req.query
        console.warn(mentorId)
        const draftCoursList=await this._courseService.getDraftedCourses(mentorId as string)
        console.log('🍉🍉',draftCoursList)
        res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK,{draftCoursList}))
      } catch (error) {
        next(error)
      }
  }
}
