import axios, { AxiosError } from "axios";
import type { AxiosInstance } from "axios";
import { AuthService } from "../service/auth.service";

const createInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1/`,
    withCredentials: true,
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const originalRequest = error.config as any;

      const isAuthEndpoint =
        originalRequest?.url?.includes("/auth/me") ||
        originalRequest?.url?.includes("/auth/refresh-token");
      console.log("isAuthEndpoin :", isAuthEndpoint);

      if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
        originalRequest._retry = true;
        try {
          await AuthService.refreshToken();
          return instance(originalRequest);
        } catch {}
      }

      return Promise.reject({
        status,
        message: (error.response?.data as any)?.error || "Request failed",
      });
    },
  );

  return instance;
};

export const axiosInstance = createInstance();
