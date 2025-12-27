import type { AxiosError } from "axios";
import { ApiError } from "./apiError.util"; 

export function throwAxiosError(error: unknown): never {
  const err = error as AxiosError<{ error: string }>;

  const message =
    err.response?.data?.error ||
    "Something went wrong. Please try later.";

  const status = err.response?.status;
  const data = err.response?.data;

  throw new ApiError(message, status, data);
}
