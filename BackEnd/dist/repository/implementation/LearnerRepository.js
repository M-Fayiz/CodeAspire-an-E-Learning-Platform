"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LearnerRepository = void 0;
const user_model_1 = require("../../models/user.model");
const baseRepository_1 = require("../baseRepository");
class LearnerRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(user_model_1.LearnerModel);
    }
    async updateLearningStreak(learnerId, streak, activeDate) {
        return await this.findByIDAndUpdate(learnerId, {
            $set: { learningStreak: streak },
            $addToSet: {
                activeDates: activeDate,
            },
        });
    }
    async getLearnerStreak(learnerId) {
        return await this.findById(learnerId);
    }
    async updateLearnerProfile(learnerId, updateQuery) {
        return await this.findByIDAndUpdateProfile(learnerId, updateQuery);
    }
}
exports.LearnerRepository = LearnerRepository;
