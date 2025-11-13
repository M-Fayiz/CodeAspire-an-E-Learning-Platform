import { axiosInstance } from "@/axios/createInstance";
import { API } from "@/constants/api.constant";
import type {
  IBookingDTOforLearner,
  IBookingDTOforMentors,
} from "@/types/DTOS/slotBooking.dto.type";
import type { ISessionBooking } from "@/types/sessionBooking.type";
import { throwAxiosError } from "@/utility/throwErrot";

export const SlotBookingSercie = {
  bookSlot: async (bookingData: ISessionBooking): Promise<string> => {
    try {
      const response = await axiosInstance.post(
        API.SLOT_BOOK.BOOK_SLOT,
        bookingData,
      );
      console.log(response.data);

      return response.data.checkoutURL;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  getUserBookingList: async (
    learnerId: string,
  ): Promise<IBookingDTOforLearner[]> => {
    try {
      const response = await axiosInstance.get(
        API.SLOT_BOOK.ListeUserBooking(learnerId),
      );
      return response.data.listsOfBooked;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  getBookedMentorSlotList: async (
    mentorId: string,
  ): Promise<IBookingDTOforMentors[]> => {
    try {
      const response = await axiosInstance.get(
        API.SLOT_BOOK.ListeMentorBooking(mentorId),
      );
      console.log("the list :", response.data.listsOfBooked);
      return response.data.listsOfBooked;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  addFeedback: async (
    slotId: string,
    feedback: string,
  ): Promise<{ feedback: string; bookedId: string }> => {
    try {
      console.log("ffff  ", feedback);
      console.log("  kkk ", slotId);
      const response = await axiosInstance.put(
        API.SLOT_BOOK.UPDATE_BOOKINGL(slotId),
        { feedback },
      );
      return response.data.updatedFeedback;
    } catch (error) {
      throwAxiosError(error);
    }
  },
};
