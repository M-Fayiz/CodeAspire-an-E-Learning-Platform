"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.learnerDashboardDetails = void 0;
const learnerDashboardDetails = (courseData = {}, slotData = {}, TotalCertificate = 0) => ({
    courseData: {
        courseCount: courseData.courseCount ?? 0,
        completedCourse: courseData.completedCourse ?? 0,
        inProgressCourse: courseData.inProgressCourse ?? 0,
    },
    slotData: {
        totalSession: slotData.totalSession ?? 0,
        totalCracked: slotData.totalCracked ?? 0,
        totalFailed: slotData.totalFailed ?? 0,
    },
    TotalCertificate,
});
exports.learnerDashboardDetails = learnerDashboardDetails;
