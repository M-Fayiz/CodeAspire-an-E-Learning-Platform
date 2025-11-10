import { HttpResponse } from "../../const/error-message";
import { HttpStatus } from "../../const/http-status";
import { slotDTO, slotPopulatedMapper } from "../../dtos/slot.dto";
import { ISlotModel } from "../../models/slot.model";
import { parseObjectId } from "../../mongoose/objectId";
import { ISlotRepository } from "../../repository/interface/ISlotRepository";
import {
  ISlotDTO,
  ISlotPopulatedDTO,
} from "../../types/dtos.type/slots.dto.type";
import { IMentorSlot } from "../../types/slot.type";
import { createHttpError } from "../../utils/http-error";
import { ISlotService } from "../interface/ISlotService";

export class SlotService implements ISlotService {
  constructor(private _slotRepository: ISlotRepository) {}
  /**
   * check if there are any course exist in same mentor , same days , same time line, if there is not create new slot
   * @param slotData
   * @returns created slot document from the DB
   */
  async createSlot(slotData: IMentorSlot): Promise<ISlotDTO> {
    const isSlotExist = await this._slotRepository.findSlot(
      slotData.mentorId,
      slotData.selectedDays,
      slotData.startTime,
      slotData.endTime,
    );
    if (isSlotExist) {
      throw createHttpError(HttpStatus.CONFLICT, HttpResponse.SLOT_EXIST);
    }
    const createdSlot = await this._slotRepository.createSlot(slotData);
    return slotDTO(createdSlot);
  }
  /**
   * fetch mentor's slot data
   * @param mentorId
   * @returns array of mapped slot data
   */
  async getMontorSlots(mentorId: string): Promise<ISlotDTO[]> {
    const mentor_Id = parseObjectId(mentorId);
    if (!mentor_Id) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.INVALID_ID);
    }

    const mentorSlots = await this._slotRepository.getMentorSLots(mentor_Id);
    if (!mentorSlots) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.ITEM_NOT_FOUND);
    }

    return mentorSlots?.map((slot) => slotDTO(slot));
  }
  /**
   * Updates a mentor's slot and validates whether any other slot
   * exists for the same mentor on the same days and within the same time range,
   * excluding the current slot being updated.
   * @param slotId
   * @param slotData
   * @returns updated slot after mapping
   */
  async updateSlot(slotId: string, slotData: ISlotModel): Promise<ISlotDTO> {
    const slot_Id = parseObjectId(slotId);
    if (!slot_Id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }
    const isSlotExist = await this._slotRepository.findSlot(
      slotData.mentorId,
      slotData.selectedDays,
      slotData.startTime,
      slotData.endTime,
      slot_Id,
    );
    if (isSlotExist) {
      throw createHttpError(HttpStatus.CONFLICT, HttpResponse.SLOT_EXIST);
    }
    const updatedSlot = await this._slotRepository.updateSlot(
      slot_Id,
      slotData,
    );
    if (!updatedSlot) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.ITEM_NOT_FOUND);
    }

    return slotDTO(updatedSlot);
  }
  /**
   * Fetch a mentor slot by its course ID.
   *
   * @param courseId - The course ID as a string.
   * @returns The mapped slot data including mentor and course details.
   * @throws {HttpError} If the course ID is invalid or no slot is found.
   */
  async getCourseSlot(courseId: string): Promise<ISlotPopulatedDTO> {
    const course_Id = parseObjectId(courseId);
    if (!course_Id) {
      throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.INVALID_ID);
    }
    const slotDAta = await this._slotRepository.getCourseSlot(course_Id);

    if (!slotDAta) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.ITEM_NOT_FOUND);
    }
    console.log("--- : ", slotDAta);
    return slotPopulatedMapper(slotDAta);
  }
}
