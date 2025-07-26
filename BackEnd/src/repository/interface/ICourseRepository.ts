import { ICourses } from "../../types/courses.type";


export interface ICourseRepository{
   createCourses(courseData:ICourses):Promise<ICourses|null>
}