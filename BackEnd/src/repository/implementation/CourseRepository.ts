
import { courseModel } from "../../models/courses.model"
import { ICourses } from "../../types/courses.type"
import { BaseRepository } from "../baseRepository"
import { ICourseRepository } from "../interface/ICourseRepository"

export class CourseRepository extends BaseRepository<ICourses> implements ICourseRepository{
    constructor(){
        super(courseModel)
    }
    async createCourses(courseData: ICourses): Promise<ICourses | null> {
        return await this.create(courseData)
    }
}