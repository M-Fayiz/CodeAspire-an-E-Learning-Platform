"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePart = exports.CourseStatus = exports.CourseLevel = exports.LectureType = void 0;
var LectureType;
(function (LectureType) {
    LectureType["VIDEO"] = "video";
    LectureType["PDF"] = "pdf";
})(LectureType || (exports.LectureType = LectureType = {}));
var CourseLevel;
(function (CourseLevel) {
    CourseLevel["BEGINNER"] = "Beginner";
    CourseLevel["INTERMEDIATE"] = "Intermediate";
    CourseLevel["ADVANCED"] = "Advanced";
})(CourseLevel || (exports.CourseLevel = CourseLevel = {}));
var CourseStatus;
(function (CourseStatus) {
    CourseStatus["IN_PROGRESS"] = "inProgress";
    CourseStatus["DRAFT"] = "draft";
    CourseStatus["PUBLISHED"] = "published";
    CourseStatus["APPROVED"] = "approved";
    CourseStatus["REJECTED"] = "rejected";
})(CourseStatus || (exports.CourseStatus = CourseStatus = {}));
var UpdatePart;
(function (UpdatePart) {
    UpdatePart["SESSIONS"] = "sessions";
    UpdatePart["LECTURE"] = "lecture";
    UpdatePart["BASE_INFORMATION"] = "baseInformation";
})(UpdatePart || (exports.UpdatePart = UpdatePart = {}));
