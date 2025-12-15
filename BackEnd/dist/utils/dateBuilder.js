"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDateFilter = buildDateFilter;
const filter_const_1 = require("../const/filter.const");
function buildDateFilter(filter) {
    const now = new Date();
    const clean = filter.trim().toLowerCase();
    let startDate = null;
    const endDate = new Date();
    switch (clean) {
        case filter_const_1.FilterByDate.Today.toLowerCase():
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
        case filter_const_1.FilterByDate.WEEK.toLowerCase():
            startDate = new Date();
            startDate.setDate(now.getDate() - 7);
            break;
        case filter_const_1.FilterByDate.MONTH.toLowerCase():
            startDate = new Date();
            startDate.setMonth(now.getMonth() - 1);
            break;
        case filter_const_1.FilterByDate.YEAR.toLowerCase():
            startDate = new Date();
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        default:
            return {};
    }
    return {
        createdAt: {
            $gte: startDate,
            $lte: endDate,
        },
    };
}
