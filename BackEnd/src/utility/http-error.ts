export class HttpError extends Error {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, HttpError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const createHttpError = (statusCode: number, message: string) => {
  const errorResponse = new HttpError(statusCode, message);
  console.log("error response from server ", errorResponse);
  return errorResponse;
};
