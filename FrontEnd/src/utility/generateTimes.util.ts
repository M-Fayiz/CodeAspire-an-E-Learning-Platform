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
