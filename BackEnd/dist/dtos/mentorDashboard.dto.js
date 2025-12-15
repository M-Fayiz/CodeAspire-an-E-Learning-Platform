"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mentorDashboardDTO = mentorDashboardDTO;
function mentorDashboardDTO(studenAndRatinng, topCourse, revanue) {
    const updatedFrmt = revanue.map((data) => ({
        name: data._id,
        value: data.revenue,
    }));
    const summary = {
        avgRating: studenAndRatinng?.avgRating ?? 0,
        totalStudents: studenAndRatinng?.totalStudents ?? 0,
    };
    return {
        summary,
        topCourse,
        revanue: updatedFrmt,
    };
}
