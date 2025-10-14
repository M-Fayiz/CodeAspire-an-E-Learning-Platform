export function calculateShares(courseAmount: number, splitPercentage: number) {
  const splitedAmunt = (courseAmount * splitPercentage) / 100;

  return splitedAmunt;
}
