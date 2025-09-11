import { axiosInstance } from "@/axios/createInstance";
import type { AxiosError } from "axios";

export const OrderService = {
  createPayment: async (
    courseId: string,
    userId: string,
  ): Promise<{
    clientSecret: string;
    orderId: string;
    checkoutURL: string;
  }> => {
    console.log("🍉", courseId, userId);
    try {
      const response = await axiosInstance.post(
        "/orders/payment/create-checkout-session",
        { courseId, userId },
      );
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      const errorMessage = err.response?.data.error;
      throw new Error(errorMessage);
    }
  },
};
