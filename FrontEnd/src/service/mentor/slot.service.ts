import { axiosInstance } from "@/axios/createInstance";
import { API } from "@/constants/api.constant";
import type { ISlotPopulatedDTO } from "@/types/DTOS/slot.dto";
import type { IMentorSlot } from "@/types/slot.types";
import { throwAxiosError } from "@/utility/throwErrot";
import { sharedService } from "../shared.service";

export const SlotService = {
  /**
   * create new Slot by mentor , or updating existing slot 
   * @param slotFormData 
   * @returns  new created document from the DB
   */
  createSlots: async (slotFormData: Partial<IMentorSlot>):Promise<IMentorSlot> => {
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
   * @param mentorId s
   * @returns an array of IMentorSlot
   */
  getMentorSlotList:async(mentorId:string):Promise<IMentorSlot[]>=>{
    try {
        const response=await axiosInstance.get(API.SLOTS.GET_MENTOR_SLOTS(mentorId))
        return response.data.mentorSlots

    } catch (error) {
        throwAxiosError(error)
    }
  },/**
   * 
   * @param slotFormData 
   * @param slotId 
   * @returns updated slot data after mapping
   */
  updateSlot:async(slotFormData: Partial<IMentorSlot>,slotId:string):Promise<IMentorSlot>=>{
    try {
      const response=await  axiosInstance.put(API.SLOTS.UPDATE_SLOT(slotId),slotFormData)
      return response.data.updatedSlot
    } catch (error) {
      throwAxiosError(error)
    }
  }
  ,
  getCourseSlot:async(courseId:string):Promise<ISlotPopulatedDTO>=>{
    try {
      console.log('course Id',courseId)
      const response=await axiosInstance.get(API.SLOTS.GET_COURSE_SLOT(courseId))
      const profileUrl=await sharedService.getPreSignedDownloadURL(response.data.slotData.mentor.profilePicture)
      response.data.slotData.mentor.profilePicture=profileUrl
      return response.data.slotData
    } catch (error) {
      throwAxiosError(error)
    }
  }
};
