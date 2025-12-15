"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseDashboardDTO = courseDashboardDTO;
exports.chartTrendDTO = chartTrendDTO;
function courseDashboardDTO(enrolledStudents, avgRating, course, revenue) {
    return {
        enrolledStudents,
        avgRating,
        course: {
            _id: course._id,
            title: course.title,
            description: course.description,
            price: course.price,
            thumbnail: course.thumbnail,
            status: course.status,
        },
        revenue: {
            admin: (revenue && revenue.adminSum) ?? 0,
            mentor: (revenue && revenue.adminSum) ?? 0,
        },
    };
}
function chartTrendDTO(data) {
    return {
        date: data._id.day,
        enrolled: data.count,
    };
}
