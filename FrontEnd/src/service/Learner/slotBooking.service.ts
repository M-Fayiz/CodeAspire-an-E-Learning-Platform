import { axiosInstance } from "@/axios/createInstance"
import { API } from "@/constants/api.constant"
import type { ISessionBooking } from "@/types/sessionBooking.type"
import { throwAxiosError } from "@/utility/throwErrot"


export const SlotBookingSercie={
    bookSlot:async(bookingData:ISessionBooking):Promise<string>=>{
        try {
            console.log('boking data L',bookingData)
            const response=await axiosInstance.post(API.SLOT_BOOK.BOOK_SLOT,bookingData)
            console.log(response.data)
       
            return response.data.checkoutURL
        } catch (error) {
            throwAxiosError(error)
        }
    }
}