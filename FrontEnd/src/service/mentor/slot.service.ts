import { axiosInstance } from "@/axios/createInstance";
import { API } from "@/constants/api.constant";
import type { IMentorSlot } from "@/types/slot.types";
import { throwAxiosError } from "@/utility/throwErrot";

export const SlotService = {
  /**
   * create new Slot by mentor
   * @param slotFormData 
   * @returns  new created document from the DB
   */
  createSlots: async (slotFormData: Partial<IMentorSlot>) => {
    console.log(slotFormData);
    try {
      const response = await axiosInstance.post(
        API.SLOTS.CREATE_SLOTS,
        slotFormData,
      );
      return response.data.createdSlot;
    } catch (error) {
      throwAxiosError(error);
    }
  },

  /**
   * fetching all the slots that created by a montor
   * @param mentorId 
   * @returns an array of IMentorSlot
   */
  getMentorSlotList:async(mentorId:string):Promise<IMentorSlot[]>=>{
    try {
        const response=await axiosInstance.get(API.SLOTS.GET_MENTOR_SLOTS(mentorId))
        return response.data.mentorSlots

    } catch (error) {
        throwAxiosError(error)
    }
  }
};
