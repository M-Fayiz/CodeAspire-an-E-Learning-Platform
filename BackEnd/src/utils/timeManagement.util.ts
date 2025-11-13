export function convertTo24Hour(time12h: string) {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");
  if (hours === "12") hours = "00";
  if (modifier === "PM") hours = String(Number(hours) + 12);
  return `${hours.padStart(2, "0")}:${minutes}`;
}

export function convertTo12Hour(time24h: string) {
  if (!time24h || typeof time24h !== "string" || !time24h.includes(":")) {
    return "";
  }

  const [hoursStr, minutesStr] = time24h.split(":");
  let h = Number(hoursStr);
  const m = Number(minutesStr) || 0;

  const period = h >= 12 ? "PM" : "AM";

  if (h === 0) h = 12;
  else if (h > 12) h -= 12;

  return `${h}:${String(m).padStart(2, "0")} ${period}`;
}
