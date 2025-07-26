import { ICourses } from "../../types/courses.type";


export interface ICourseService{
    createCourses(course:ICourses):Promise<ICourses|null>
}