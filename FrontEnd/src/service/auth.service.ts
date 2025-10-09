import type { AxiosError } from "axios";
import { axiosInstance } from "../axios/createInstance";
import type { IDecodedUserType, ILogin, ISignUp } from "../types/auth.types";
import { API } from "../constants/api.constant";
import type { UserRole } from "../types/auth.types";
import { throwAxiosError } from "@/utility/throwErrot";
import { sharedService } from "./shared.service";

export const AuthService = {
  signUp: async (
    data: ISignUp,
  ): Promise<{ status: number; message: string; email: string }> => {
    try {
      const response = await axiosInstance.post(API.Auth.SIGNUP_URL, data);
      return response.data;
    } catch (error: unknown) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage =
        err.response?.data?.error || "Registration Failed, Please try again ";

      throw new Error(errorMessage);
    }
  },
  verifyEmail: async (
    email: string | null,
    token: string | null,
  ): Promise<{ status: number; message: string }> => {
    try {
      const response = await axiosInstance.post(API.Auth.VERIFY_EMAIL_URL, {
        token,
        email,
      });

      return response.data.message;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  authME: async (): Promise<IDecodedUserType> => {
    try {
      const response = await axiosInstance.post(
        API.Auth.AUTH_URL,
        {},
        { withCredentials: true },
      );
      if (response.data.user.profile) {
        const profilrUrl = await sharedService.getPreSignedDownloadURL(
          response.data.user.profile,
        );
        console.log(profilrUrl);
        if (profilrUrl) {
          response.data.user.profile = profilrUrl;
        }
      }
      console.log(" this the profile ur; ", response.data.user.profile);
      return response.data?.user;
    } catch (error) {
      throwAxiosError(error);
    }
  },

  //  axios interseptor
  refreshToken: async (): Promise<{
    id: string;
    email: string;
    role: string;
  } | null> => {
    try {
      const response = await axiosInstance.get(API.Auth.REFRESH_TOKEN_URL, {
        withCredentials: true,
      });
      return response?.data.user;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  login: async (
    data: ILogin,
  ): Promise<{
    status: number;
    message: string;
    id: string;
    email: string;
    role: string;
  }> => {
    try {
      const response = await axiosInstance.post(API.Auth.LOGIN_URL, data);

      return response?.data;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  logOut: async () => {
    try {
      const response = await axiosInstance.post(
        API.Auth.LOGOUT_URL,
        {},
        { withCredentials: true },
      );

      if (response.status == 200) return true;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  googleAuth: async (role: UserRole): Promise<void> => {
    try {
      window.location.href = `${import.meta.env.VITE_BASE_URL}/auth/google?role:${role}`;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  forgotPassword: async (
    email: string,
  ): Promise<{ status: number; message: string; email: string }> => {
    try {
      const response = await axiosInstance.post(API.Auth.FORGOT_PASSWORD_URL, {
        email,
      });
      return response.data?.email;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  resetPassword: async (
    email: string,
    token: string,
    password: string,
  ): Promise<{ status: number; message: string; email: string }> => {
    try {
      const response = await axiosInstance.patch(API.Auth.RESET_PASSWORD_URL, {
        email,
        token,
        password,
      });
      return response?.data;
    } catch (error) {
      throwAxiosError(error);
    }
  },
};
