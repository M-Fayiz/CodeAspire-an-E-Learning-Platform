import { dayMap, type ISlotPopulatedDTO } from "@/types/DTOS/slot.dto";

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

function timeToMinutes(timeStr :string) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
  let hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;
  const formattedMins = mins.toString().padStart(2, "0");
  return `${hours}:${formattedMins} ${ampm}`;
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
  const nextWeek = getNextWeekDates();

  return nextWeek
    .filter((date) => slot.selectedDays.includes(dayMap[date.getDay()]))
    .map((date) => ({
      formattedDate: date.toLocaleDateString("en-GB", {
        weekday: "short",
        month: "short",
        day: "numeric"
      }),
      startTime: slot.startTime,
      endTime: slot.endTime
    }));
}


export function createSlotTime(durationMinutes:number, startTime:string, endTime:string) {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  const slots = [];

  for (let current = start; current + durationMinutes <= end; current += durationMinutes) {
    const slotStart = minutesToTime(current);
    const slotEnd = minutesToTime(current + durationMinutes);
    slots.push({ start: slotStart, end: slotEnd });
  }

  return slots;
}
