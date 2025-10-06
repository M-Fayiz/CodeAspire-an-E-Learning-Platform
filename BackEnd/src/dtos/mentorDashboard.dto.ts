import { IMentorDhasboardDTO } from "../types/dtos.type/mentorDashboard.dto.type";
import { IMentorDashboardData, IMentorTotalRevanue, ITopCourse } from "../types/mentorDashboard.types";


export function mentorDashboardDTO(studenAndRatinng:IMentorDashboardData,
    topCourse:ITopCourse[],
    revanue:IMentorTotalRevanue[]):IMentorDhasboardDTO{
        let rev=revanue.length==0?0:revanue[0].revenue
        return{
            summary:studenAndRatinng,
            topCourse:topCourse,
            revanue:rev,
        }

}