import { axiosInstance } from "@/axios/createInstance";
import { API } from "@/constants/api.constant";
import type {
  IBookingDTOforLearner,
  IBookingDTOforMentors,
  slotStatus,
} from "@/types/DTOS/slotBooking.dto.type";
import type {
  ISessionBooking,
  studentStatus,
} from "@/types/sessionBooking.type";
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
    page:number,
    search:string
  ): Promise<IBookingDTOforMentors[]> => {
    try {

      const response = await axiosInstance.get(
        API.SLOT_BOOK.ListeMentorBooking(mentorId),
      );

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
      const response = await axiosInstance.put(
        API.SLOT_BOOK.UPDATE_BOOKINGL(slotId),
        { feedback },
      );

      return response.data.updatedFeedback;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  updateStudentStatus: async (
    slotBookingId: string,
    studentStatus: studentStatus,
  ): Promise<{ bookedId: string; status: studentStatus }> => {
    try {
      const response = await axiosInstance.put(
        API.SLOT_BOOK.UPDATE_STUDENT_STATUS(slotBookingId),
        { studentStatus },
      );
      return response.data.updatedData;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  updateBookedSlotStatus: async (
    bookedId: string,
    status: slotStatus,
  ): Promise<{ bookedId: string; status: slotStatus }> => {
    try {
      const response = await axiosInstance.put(
        API.SLOT_BOOK.UPDATE_BOOKED_SLOT_STATUS(bookedId),
        { status },
      );
      return response.data;
    } catch (error) {
      throwAxiosError(error);
    }
  },
  cancelSlot: async (bookedId: string): Promise<slotStatus> => {
    try {
      const response = await axiosInstance.post(
        API.SLOT_BOOK.CANCEL_BOOKED_SLOT(bookedId),
      );
      return response.data.status;
    } catch (error) {
      throwAxiosError(error);
    }
  },
};
