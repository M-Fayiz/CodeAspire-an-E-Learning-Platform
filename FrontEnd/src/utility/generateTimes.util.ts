import { type ISlotPopulatedDTO } from "@/types/DTOS/slot.dto";

export function generateTimeOptions(intervalMinutes = 30) {
  const times = [];
  const totalMinutes = 24 * 60;

  for (let i = 0; i < totalMinutes; i += intervalMinutes) {
    const hours = Math.floor(i / 60);
    const minutes = i % 60;
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    times.push(`${displayHours}:${displayMinutes} ${period}`);
  }
  return times;
}

export function convertTo24Hour(time12h: string) {
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");
  if (hours === "12") hours = "00";
  if (modifier === "PM") hours = String(Number(hours) + 12);
  return `${hours.padStart(2, "0")}:${minutes}`;
}

export function convertTo12Hour(time24h: string) {
  let [hours, minutes] = time24h.split(":");
  let h = Number(hours);
  const period = h >= 12 ? "PM" : "AM";

  if (h === 0) h = 12;
  else if (h > 12) h = h - 12;

  return `${String(h).padStart(2, "0")}:${minutes} ${period}`;
}

export function getNextWeekDates(): Date[] {
  const today = new Date();
  const next7Days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const next = new Date(today);
    next.setDate(today.getDate() + i);
    next7Days.push(next);
  }
  return next7Days;
}

export function getSlotDatesForMentor(slot: ISlotPopulatedDTO) {
  const today = new Date();
  const next7Days: { date: Date; day: string; formattedDate: string }[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const weekday = d.toLocaleDateString("en-US", { weekday: "long" });

    const slotDay = slot.selectedDays.find(
      (sd) => sd.day === weekday && sd.active,
    );
    if (slotDay) {
      next7Days.push({
        date: d,
        day: weekday,
        formattedDate: d.toLocaleDateString("en-GB", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      });
    }
  }

  return next7Days;
}

export function createSlotTime(duration: number, start: string, end: string) {
  const slots: { start: string; end: string }[] = [];

  if (!start || !end) return slots;

  const toMinutes = (t: string) => {
    const [time, period] = t.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (period) {
      if (period.toUpperCase() === "PM" && hours !== 12) hours += 12;
      if (period.toUpperCase() === "AM" && hours === 12) hours = 0;
    }

    return hours * 60 + minutes;
  };

  const fromMinutes = (m: number) => {
    const hours = Math.floor(m / 60);
    const minutes = m % 60;
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHour = hours % 12 || 12;
    return `${formattedHour}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const startMinutes = toMinutes(start);
  const endMinutes = toMinutes(end);

  if (isNaN(startMinutes) || isNaN(endMinutes)) return slots;

  let current = startMinutes;

  while (current + duration <= endMinutes) {
    slots.push({
      start: fromMinutes(current),
      end: fromMinutes(current + duration),
    });
    current += duration;
  }

  return slots;
}
