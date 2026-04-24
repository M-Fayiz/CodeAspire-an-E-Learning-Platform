import { Types } from "mongoose";
import { IAuthSession, IAuthSessionModel } from "../../models/session.model";

export interface ISessionRepository {
  createSession(sessionData: Partial<IAuthSession>): Promise<IAuthSessionModel>;
  findSessionByTokenHash(tokenHash: string): Promise<IAuthSessionModel | null>;
  findActiveSessionById(
    sessionId: Types.ObjectId,
  ): Promise<IAuthSessionModel | null>;
  touchSession(
    sessionId: Types.ObjectId,
    lastUsedAt?: Date,
  ): Promise<IAuthSessionModel | null>;
  revokeSession(
    sessionId: Types.ObjectId,
    replacedBy?: Types.ObjectId | null,
  ): Promise<IAuthSessionModel | null>;
  revokeUserSessions(userId: Types.ObjectId): Promise<number>;
}
