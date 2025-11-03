import { IAdminDashboardDTO } from "../types/dtos.type/adminDashboard.dto.type";
import { ITopCategory, ITopCourse } from "../types/mentorDashboard.types";

export function adminDashboardDTO(mentor:number,learners:number,courses:number,revenue:number,topCourse:ITopCourse[],topCategory:ITopCategory[]):IAdminDashboardDTO{
    return{
        totalCourses:courses,
        totalLearners:learners,
        totalMentors:mentor,
        totalRevenue:revenue,
        topSelling:{
            category:topCategory,
            course:topCourse
        }
    }
}