export function getRefundPercentage(slotStart: Date | string): number {
  const now = new Date().getTime();
  const start = new Date(slotStart).getTime();

  const diffInHours = (start - now) / (1000 * 60 * 60);

  if (diffInHours >= 24) return 100;
  if (diffInHours >= 12) return 50;
  return 0;
}
