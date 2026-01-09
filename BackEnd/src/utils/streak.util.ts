import { HttpResponse } from "../const/error-message.const";
import { HttpStatus } from "../const/http-status.const";
import { ILearnerModel } from "../models/user.model";
import { createHttpError } from "./http-error";

export function normalizeDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function updateLearningStreak(learner: ILearnerModel) {
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

  const diffDays =
    (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays === 0) {
    return learner.learningStreak;
  }
  if (!learner.learningStreak) {
    throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.ITEM_NOT_FOUND);
  }

  if (diffDays === 1) {
    learner.learningStreak.current += 1;
  } else {
    learner.learningStreak.current = 1;
  }

  learner.learningStreak.longest = Math.max(
    learner.learningStreak.longest,
    learner.learningStreak.current,
  );

  learner.learningStreak.lastLearningDate = today;

  return learner.learningStreak;
}
