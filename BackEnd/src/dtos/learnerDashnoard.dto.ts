import { learnerDashboardCardsDTO } from "../types/dtos.type/learnerDashboard.dto.type";
import { LearnerCourseCard, LearnerSlotCard } from "../types/learnerDashboard.type";


export function learnerDashboardDetails(courseData:LearnerCourseCard,slotData:LearnerSlotCard,certificate:number):learnerDashboardCardsDTO{
        return{
            TotalCertificate:certificate,
            courseData:courseData,
            slotData:slotData
        }
}