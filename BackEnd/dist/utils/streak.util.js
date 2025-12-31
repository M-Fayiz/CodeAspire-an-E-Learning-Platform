"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeDate = normalizeDate;
exports.updateLearningStreak = updateLearningStreak;
const error_message_const_1 = require("../const/error-message.const");
const http_status_const_1 = require("../const/http-status.const");
const http_error_1 = require("./http-error");
function normalizeDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
function updateLearningStreak(learner) {
    const today = normalizeDate(new Date());
    const lastDate = learner.learningStreak?.lastLearningDate
        ? normalizeDate(new Date(learner.learningStreak.lastLearningDate))
        : null;
    if (!lastDate) {
        learner.learningStreak = {
            current: 1,
            longest: 1,
            lastLearningDate: today,
        };
        return learner.learningStreak;
    }
    const diffDays = (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays === 0) {
        return learner.learningStreak;
    }
    if (!learner.learningStreak) {
        throw (0, http_error_1.createHttpError)(http_status_const_1.HttpStatus.NOT_FOUND, error_message_const_1.HttpResponse.ITEM_NOT_FOUND);
    }
    if (diffDays === 1) {
        learner.learningStreak.current += 1;
    }
    else {
        learner.learningStreak.current = 1;
    }
    learner.learningStreak.longest = Math.max(learner.learningStreak.longest, learner.learningStreak.current);
    learner.learningStreak.lastLearningDate = today;
    return learner.learningStreak;
}
