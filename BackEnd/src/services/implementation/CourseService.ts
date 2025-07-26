import { ICourseRepository } from "../../repository/interface/ICourseRepository";
import { ICourses } from "../../types/courses.type";
import { ICourseService } from "../interface/ICourseService";




export class CourseService implements ICourseService{
    constructor(private  _courseService:ICourseRepository){}

    async createCourses(course: ICourses): Promise<ICourses | null> {
       return await this._courseService.createCourses(course)
    }

}