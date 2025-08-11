import { parseObjectId } from "../../mongoose/objectId";
import { ICategoryRepository } from "../../repository/interface/ICategoryRepository";
import { ICourseRepository } from "../../repository/interface/ICourseRepository";
import { ICourses, ILecture, ISession } from "../../types/courses.type";
import { ICourseService } from "../interface/ICourseService";

import {
  ICourseDTO,
  ICourseListDTO,
  ICoursesPopulated,
} from "../../types/dtos.type/course.dtos.type";
import { courseDTO, courseListDTO } from "../../dtos/course.dtos";
import { createHttpError } from "../../utility/http-error";
import { HttpStatus } from "../../const/http-status";
import { HttpResponse } from "../../const/error-message";

export class CourseService implements ICourseService {
  constructor(
    private _courseRepository: ICourseRepository,
    private _categoryRepository: ICategoryRepository,
  ) {}

  async createCourses(course: ICourses): Promise<ICourses | null> {
    return await this._courseRepository.createCourses(course);
  }
  async fetchCourses(): Promise<ICourseListDTO[] | null> {
    const courseList = await this._courseRepository.fetchCourses();
    if (!courseList) return null;

    const mappedCourseList = courseList.map((course) =>
      courseListDTO(course as ICoursesPopulated),
    );
    return mappedCourseList;
  }
  async updateCourseData(
    courseId: string,
    courseData: Partial<ICourses> | ISession | ILecture,
    courseUpdatePart: "sessions" | "lecture" | "baseInformation",
  ): Promise<ICourses | null> {
    const Id = parseObjectId(courseId);
    if (!Id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }
    switch (courseUpdatePart) {
      case "sessions":
        return await this._courseRepository.addSession(
          Id,
          courseData as ISession,
        );
    }
    // const updatedData=await this._courseRepository.updateCourse(Id,courseData,)
    return null;
  }
  async getCourse(courseId: string): Promise<ICourseDTO|null> {
      let id=parseObjectId(courseId)
      if(!id){
        throw createHttpError(HttpStatus.OK,HttpResponse.INVALID_ID)
      }
      const courseData= await this._courseRepository.getCourse(id)
      if(!courseData) return null
      return courseDTO(courseData as ICoursesPopulated)
  }
  async getDraftedCourses(mentorId: string): Promise<ICourseDTO[] | null> {
    console.log('🔥🔥',mentorId)
    const id=parseObjectId(mentorId)
    if(!id){
      throw createHttpError(HttpStatus.OK,HttpResponse.INVALID_ID)
    }
    const data=await this._courseRepository.getMentorDraftedCourses(id)
    let mappedCourseList=data?.map((course)=>courseDTO(course as ICoursesPopulated ))
    return mappedCourseList?mappedCourseList:null
  }
}
