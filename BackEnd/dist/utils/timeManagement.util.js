"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTo24Hour = convertTo24Hour;
exports.convertTo12Hour = convertTo12Hour;
function convertTo24Hour(time12h) {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12")
        hours = "00";
    if (modifier === "PM")
        hours = String(Number(hours) + 12);
    return `${hours.padStart(2, "0")}:${minutes}`;
}
function convertTo12Hour(time24h) {
    if (!time24h || typeof time24h !== "string" || !time24h.includes(":")) {
        return "";
    }
    const [hoursStr, minutesStr] = time24h.split(":");
    let h = Number(hoursStr);
    const m = Number(minutesStr) || 0;
    const period = h >= 12 ? "PM" : "AM";
    if (h === 0)
        h = 12;
    else if (h > 12)
        h -= 12;
    return `${h}:${String(m).padStart(2, "0")} ${period}`;
}
