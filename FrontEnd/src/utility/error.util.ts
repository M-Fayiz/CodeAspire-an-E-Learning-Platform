export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "HttpError";
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}
