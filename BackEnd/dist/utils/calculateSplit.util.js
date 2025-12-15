"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateShares = calculateShares;
function calculateShares(courseAmount, splitPercentage) {
    const splitedAmunt = (courseAmount * splitPercentage) / 100;
    return splitedAmunt;
}
