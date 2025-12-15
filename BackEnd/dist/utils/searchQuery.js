"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUserFilter = void 0;
const buildUserFilter = (query) => {
    const filter = {
        role: { $ne: "admin" },
    };
    if (query.name) {
        filter.name = { $regex: query.name, $options: "i" };
    }
    if (query.role) {
        filter.role = query.role;
    }
    if (typeof query.isActive === "boolean") {
        filter.isActive = query.isActive;
    }
    return filter;
};
exports.buildUserFilter = buildUserFilter;
