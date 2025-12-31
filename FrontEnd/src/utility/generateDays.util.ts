function generateLast365Days() {
  const days: string[] = [];
  const today = new Date();

  for (let i = 364; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }

  return days;
}

export default generateLast365Days