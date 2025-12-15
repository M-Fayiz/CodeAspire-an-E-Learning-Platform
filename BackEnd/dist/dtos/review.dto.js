"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewDTO = reviewDTO;
exports.popularedReviewDTO = popularedReviewDTO;
function reviewDTO(data) {
    return {
        _id: data._id,
        courseId: data.courseId,
        learnerId: data.learnerId,
        rating: data.rating ? data.rating : null,
        comment: data.comment,
        replies: data.replies
            ? {
                mentorId: data.replies.mentorId,
                comment: data.replies.comment,
            }
            : undefined,
    };
}
function popularedReviewDTO(data) {
    return {
        _id: data._id,
        courseId: data.courseId,
        learner: {
            _id: data.learnerId._id,
            name: data.learnerId.name,
            profilePicture: data.learnerId.profilePicture,
        },
        rating: data.rating ?? null,
        comment: data.comment,
        replies: data.replies?.mentor
            ? {
                menterId: data.replies.mentor._id,
                name: data.replies.mentor.name,
                profilePicture: data.replies.mentor.profilePicture,
            }
            : null,
        createdAt: data.createdAt,
    };
}
