import { axiosInstance } from "@/axios/createInstance";
import { API } from "@/constants/api.constant";
import { throwAxiosError } from "@/utility/throwErrot";


export const OrderService = {
  createPayment: async (
    courseId: string,
    userId: string,
  ): Promise<{
    clientSecret: string;
    orderId: string;
    checkoutURL: string;
  }> => {
    try {
      const response = await axiosInstance.post(
        "/orders/payment/create-checkout-session",
        { courseId, userId },
      );
      return response.data;
    } catch (error) {
      throwAxiosError(error);
    }
  },

  getOrderDetails: async (sessionId: string) => {
    try {
      const response = await axiosInstance.get(
        API.PAYMENT.GET_PAYMENT_DATA(sessionId),
      );
      return response.data.paymentdata;
    } catch (error) {
      throwAxiosError(error);
    }
  },
};
