import type { AxiosError } from "axios";

export function throwAxiosError(error :unknown):never{

     const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Something went wrong , Please try Later ";

      throw new Error(errorMessage);
 
}