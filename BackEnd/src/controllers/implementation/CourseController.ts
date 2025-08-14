import { Request, Response, NextFunction } from "express";
import { ICourseService } from "../../services/interface/ICourseService";
import { ICourseController } from "../interface/ICourseController";
import { HttpStatus } from "../../const/http-status";
import { successResponse } from "../../utility/response.util";
import { HttpResponse } from "../../const/error-message";
import { updatePart } from "../../types/courses.type";
import { session } from "passport";

export class CourseController implements ICourseController {
  constructor(private _courseService: ICourseService) {}

  addCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      

      const createdCourseData = await this._courseService.createCourses(
        req.body.courseData,
      );
      console.log('❌❌❌',createdCourseData)
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
  addSession=async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
    try {
      
      const {id}=req.params
      const {session}=req.body
      console.log('😶‍🌫️😶‍🌫️',session)
      const addedSessionData=await this._courseService.addSessions(id,session)  
      res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK,{addedSessionData}))
    } catch (error) {
      next(error)
    }
  }
  addLecture=async(req: Request, res: Response, next: NextFunction): Promise<void>=> {
    try {
      
      const {courseId}=req.params
      const {sessionId}=req.query
      const {lecture}=req.body
      console.log(courseId,'😶‍🌫️',sessionId,'🍉',lecture)
      const addedLectureData=await this._courseService.addLectures(courseId,sessionId as string,lecture)
      res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK,{addedLectureData}))
    } catch (error) {
      next(error)
    }
  }
}
