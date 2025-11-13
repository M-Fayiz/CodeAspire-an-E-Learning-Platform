export function timeAndDateGenerator(
  dateStr: string,
  startTime: string,
  endTime: string,
) {
  const baseDate = new Date(dateStr);
  if (isNaN(baseDate.getTime())) {
    throw new Error(`Invalid date provided: ${dateStr}`);
  }

  const parseTime = (time: string) => {
    if (!time) throw new Error("Invalid time input");

    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return { hours, minutes };
  };

  const { hours: startH, minutes: startM } = parseTime(startTime);
  const { hours: endH, minutes: endM } = parseTime(endTime);

  const startDate = new Date(baseDate);
  startDate.setUTCHours(startH, startM, 0, 0);

  const endDate = new Date(baseDate);
  endDate.setUTCHours(endH, endM, 0, 0);

  return {
    date: baseDate,
    startTime: startDate.toISOString(),
    endTime: endDate.toISOString(),
  };
}
