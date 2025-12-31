"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.learnerDashboardDetails = void 0;
const learnerDashboardDetails = (courseData = {}, slotData = {}, TotalCertificate = 0, learner, inProgress) => {
    const InProgressCourse = inProgress.map(course => {
        return {
            enrolledId: course._id,
            title: course.courseId.title,
            progress: course.progress.completionPercentage
        };
    });
    return {
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
        activeDays: learner.activeDates ?? [],
        learnerStreak: learner.learningStreak ?? null,
        inProgress: InProgressCourse
    };
};
exports.learnerDashboardDetails = learnerDashboardDetails;
