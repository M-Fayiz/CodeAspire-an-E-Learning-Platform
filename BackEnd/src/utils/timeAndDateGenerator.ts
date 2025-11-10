export function timeAndDateGenerator(
  date: string,
  startTime: string,
  endTime: string,
) {
  const year = new Date().getFullYear();
  const start = new Date(`${date} ${year} ${startTime}`).toISOString();
  const end = new Date(`${date} ${year} ${endTime}`).toISOString();

  return { date: new Date(`${date} ${year}`), startTime: start, endTime: end };
}
