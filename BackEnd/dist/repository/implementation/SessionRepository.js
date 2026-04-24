"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionRepository = void 0;
const session_model_1 = require("../../models/session.model");
const baseRepository_1 = require("../baseRepository");
class SessionRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(session_model_1.AuthSessionModel);
    }
    async createSession(sessionData) {
        return this.create(sessionData);
    }
    async findSessionByTokenHash(tokenHash) {
        return this.findOne({
            tokenHash,
            revokedAt: null,
            expiresAt: { $gt: new Date() },
        });
    }
    async findActiveSessionById(sessionId) {
        return this.findOne({
            _id: sessionId,
            revokedAt: null,
            expiresAt: { $gt: new Date() },
        });
    }
    async touchSession(sessionId, lastUsedAt = new Date()) {
        return this.findByIDAndUpdate(sessionId, { lastUsedAt });
    }
    async revokeSession(sessionId, replacedBy = null) {
        return this.findByIDAndUpdate(sessionId, {
            revokedAt: new Date(),
            replacedBy,
        });
    }
    async revokeUserSessions(userId) {
        const result = await this.model.updateMany({
            userId,
            revokedAt: null,
        }, {
            $set: { revokedAt: new Date() },
        });
        return result.modifiedCount;
    }
}
exports.SessionRepository = SessionRepository;
