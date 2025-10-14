
export const generateParticipantKey = (userIdA: string, userIdB: string) => {
  const key = [userIdA, userIdB].sort().join('_')
  return `${key}`;
};
