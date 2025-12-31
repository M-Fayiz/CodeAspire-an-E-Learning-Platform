"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseListDTO = courseListDTO;
exports.courseDTO = courseDTO;
exports.formCourseDto = formCourseDto;
exports.courseDetailsPageDTO = courseDetailsPageDTO;
exports.listCourseForSLot = listCourseForSLot;
exports.CourseFormDataDTO = CourseFormDataDTO;
function courseListDTO(course, enrolledIds) {
    return {
        _id: course._id,
        title: course.title,
        thumbnail: course.thumbnail,
        category: typeof course.categoryId == "object" && "title" in course.categoryId
            ? course.categoryId.title
            : "",
        subCategory: typeof course.subCategoryId == "object" && "title" in course.subCategoryId
            ? course.subCategoryId.title
            : "",
        language: course.language,
        level: course.level,
        price: course.price,
        isEnrolled: enrolledIds?.has(String(course._id)) ?? false,
    };
}
function courseDTO(course, isEnrolled) {
    return {
        _id: course._id,
        title: course.title,
        description: course.description ? course.description : "",
        thumbnail: course.thumbnail,
        category: typeof course.categoryId == "object" && "title" in course.categoryId
            ? course.categoryId.title
            : "",
        subCategory: typeof course.subCategoryId == "object" && "title" in course.subCategoryId
            ? course.subCategoryId.title
            : "",
        language: course.language,
        level: course.level,
        price: course.price,
        sessions: course.sessions ? course.sessions : null,
        isEnrolled: isEnrolled ? isEnrolled : false,
    };
}
function formCourseDto(course) {
    return {
        _id: course._id,
        title: course.title || "",
        description: course.description || "",
        thumbnail: course.thumbnail || "",
        category: {
            _id: course.categoryId._id,
            title: course.categoryId.title,
        },
        subCategory: {
            _id: course.subCategoryId._id,
            title: course.subCategoryId.title,
        },
        language: course.language,
        level: course.level,
        price: course.price,
        mentorId: {
            _id: course.mentorId._id,
            name: course.mentorId.name,
            email: course.mentorId.email,
        },
        sessions: course.sessions ?? [],
        status: course.status,
        updated: course.updatedAt.toISOString(),
    };
}
function courseDetailsPageDTO(course, courseReview, avgRating, enrolledStd) {
    const excludedLecture = course.sessions?.map((session) => ({
        ...session,
        lectures: session.lectures.map(({ lectureContent, ...rest }) => rest),
    }));
    return {
        _id: course._id,
        title: course.title || "",
        description: course.description || "",
        thumbnail: course.thumbnail || "",
        category: {
            _id: course.categoryId._id,
            title: course.categoryId.title,
        },
        subCategory: {
            _id: course.subCategoryId._id,
            title: course.subCategoryId.title,
        },
        language: course.language,
        level: course.level,
        price: course.price,
        mentorId: {
            _id: course.mentorId._id,
            name: course.mentorId.name,
            email: course.mentorId.email,
        },
        sessions: excludedLecture ?? [],
        status: course.status,
        updated: course.updatedAt.toISOString(),
        courseReviews: courseReview,
        avgRating: avgRating,
        enrolledStd: enrolledStd,
    };
}
function listCourseForSLot(course) {
    return {
        _id: course._id,
        title: course.title,
    };
}
function CourseFormDataDTO(course) {
    return {
        _id: course._id,
        title: course.title,
        language: course.language,
        level: course.level,
        price: course.price,
        status: course.status,
        description: course.description,
        thumbnail: course.thumbnail,
        categoryId: course.categoryId,
        subCategoryId: course.subCategoryId,
        mentorId: course.mentorId,
        sessions: course.sessions,
    };
}
