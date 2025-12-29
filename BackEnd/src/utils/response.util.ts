export const successResponse = <T extends object>(message: string, data: T) => {
  return {
    success: true,
    message,
    ...data,
  };
};
