import { Request, Response, NextFunction } from "express";
import { ICourseService } from "../../services/interface/ICourseService";
import { ICourseController } from "../interface/ICourseController";
import { HttpStatus } from "../../const/http-status";
import { successResponse } from "../../utils/response.util";
import { HttpResponse } from "../../const/error-message";
import { updatePart } from "../../types/courses.type";
import logger from "../../config/logger.config";
import { sendNotification } from "../../utils/socket.utils";

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
      const courseId = req.params.id;
      const updatedPart = req.query.course_part;
      const courseData = req.body;
      console.log(courseId, updatedPart, courseData);
      const updatedCourseData = await this._courseService.updateCourseData(
        courseId,
        courseData,
        updatedPart as updatePart,
      );
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { updatedCourseData }));
    } catch (error) {
      next(error);
    }
  };
  fetchCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const {
        search,
        category,
        subcategory,
        level,
        page = 1,
        limit = 1,
        learnerId,
      } = req.query;

      const { courseData, totalPage } = await this._courseService.fetchCourses(
        Number(page || 1),
        Number(limit || 6),
        search as string,
        category as string,
        subcategory as string,
        level as string,
        learnerId as string,
      );

      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { courseData, totalPage }));
    } catch (error) {
      next(error);
    }
  };
  getCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const courseId = req.params.id;
      const { learnerId } = req.query;

      const course = await this._courseService.getCourse(
        courseId,
        learnerId as string,
      );
      console.log("this is the course ", course);
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { course }));
    } catch (error) {
      next(error);
    }
  };
  getMentorDraftedCourseList = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { mentorId, search, page } = req.query;

      const draftCoursList = await this._courseService.getDraftedCourses(
        search as string,
        page as string,
        mentorId as string,
      );

      res.status(HttpStatus.OK).json(
        successResponse(HttpResponse.OK, {
          courseData: draftCoursList?.courseData,
          totalPage: draftCoursList?.totalPage,
        }),
      );
    } catch (error) {
      next(error);
    }
  };
  addSession = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { session } = req.body;

      const addedSessionData = await this._courseService.addSessions(
        id,
        session,
      );
      console.warn(addedSessionData);
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { addedSessionData }));
    } catch (error) {
      next(error);
    }
  };
  addLecture = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { courseId, sessionId } = req.params;
      const { lecture } = req.body;

      const addedLectureData = await this._courseService.addLectures(
        courseId,
        sessionId as string,
        lecture,
      );
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { addedLectureData }));
    } catch (error) {
      next(error);
    }
  };
  editLecture = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { courseId, lectureId, sessionId } = req.params;

      const { lecture } = req.body;

      const updatedData = await this._courseService.editLecture(
        courseId,
        sessionId,
        lectureId,
        lecture,
      );
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { updatedData }));
    } catch (error) {
      next(error);
    }
  };
  updateBaseInfo = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      logger.info("just get into updateInfo");
      const { courseId } = req.params;
      const { courseData } = req.body;
      const updatedData = await this._courseService.updateBaseCourseInfo(
        courseId,
        courseData,
      );
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { updatedData }));
    } catch (error) {
      next(error);
    }
  };
  getAdminCoursList = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const coursList = await this._courseService.getAdminCourse();
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { coursList }));
    } catch (error) {
      next(error);
    }
  };
  getCourseDetails = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      console.log("get in to contr cour det", courseId);
      const courseDetails =
        await this._courseService.getCourseDetails(courseId);
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { courseDetails }));
    } catch (error) {
      next(error);
    }
  };
  approveCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      const status = await this._courseService.approveCourse(courseId);
      const data = {
        title: status.notifyDTO.title,
        message: status.notifyDTO.message,
      };
      sendNotification(status.notifyDTO.userId, status.notifyDTO);
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { status: status.status }));
    } catch (error) {
      next(error);
    }
  };
  rejectCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      const { feedBack, email } = req.body;

      const status = await this._courseService.rejectCourse(
        courseId,
        feedBack,
        email,
      );

      console.log("this is the notify :", status.notifyDTO);
      const data = {
        title: status.notifyDTO.title,
        message: status.notifyDTO,
      };

      console.log("data ", data);
      sendToUser(status.notifyDTO.userId, status.notifyDTO);
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { status }));
    } catch (error) {
      next(error);
    }
  };
  publishCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      const status = await this._courseService.publishCourse(courseId);
      res
        .status(HttpStatus.OK)
        .json(successResponse(HttpResponse.OK, { status }));
    } catch (error) {
      next(error);
    }
  };
}
