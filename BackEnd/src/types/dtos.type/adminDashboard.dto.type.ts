import { ITopCategory, ITopCourse } from "../mentorDashboard.types"

export interface IAdminDashboardDTO{
    totalMentors:number,
    totalLearners:number,
    totalRevenue:number,
    totalCourses:number,
    topSelling:{
        course:ITopCourse[],
        category:ITopCategory[]
    }
}