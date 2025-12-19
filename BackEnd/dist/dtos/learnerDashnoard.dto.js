"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.learnerDashboardDetails = learnerDashboardDetails;
function learnerDashboardDetails(courseData, slotData, certificate) {
    return {
        TotalCertificate: certificate,
        courseData: courseData,
        slotData: slotData
    };
}
