"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateParticipantKey = void 0;
const generateParticipantKey = (userIdA, userIdB) => {
    const key = [userIdA, userIdB].sort().join("_");
    return `${key}`;
};
exports.generateParticipantKey = generateParticipantKey;
