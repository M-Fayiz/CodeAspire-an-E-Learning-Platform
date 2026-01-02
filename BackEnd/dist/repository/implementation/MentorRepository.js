"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorRepository = void 0;
const user_model_1 = require("../../models/user.model");
const baseRepository_1 = require("../baseRepository");
class MentorRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(user_model_1.MentorModel);
    }
    async updateMentorProfile(id, update) {
        return await this.findByIDAndUpdateProfile(id, update);
    }
}
exports.MentorRepository = MentorRepository;
