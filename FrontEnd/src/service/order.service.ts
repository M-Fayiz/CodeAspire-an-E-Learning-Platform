import { axiosInstance } from "@/axios/createInstance";
import { API } from "@/constants/api.constant";
import type { ITransactionDTO } from "@/types/transaction.type";
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
        API.PAYMENT.CREATE_PAYMENT_INTENT,
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
      console.log(response.data);
      return response.data.paymentdata;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  getTransactionHistory:async(page:number):Promise<{transactionHistory:ITransactionDTO[],totalPage:number}>=>{
    try {
      const response= await axiosInstance.get(API.PAYMENT.TRANSACTION_HISTORY,{

        params:{page}
      })
      return response.data
    } catch (error) {
      throwAxiosError(error)
    }
  }
};
