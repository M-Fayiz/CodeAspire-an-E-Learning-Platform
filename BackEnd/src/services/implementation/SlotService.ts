import { HttpResponse } from "../../const/error-message";
import { HttpStatus } from "../../const/http-status";
import {
  mentorSlotsDTO,
  slotDTO,
  slotPopulatedMapper,
} from "../../dtos/slot.dto";
import { ISlotModel } from "../../models/slot.model";
import { parseObjectId } from "../../mongoose/objectId";
import { ISlotBookingRepository } from "../../repository/interface/ISlotBookingRepository";
import { ISlotRepository } from "../../repository/interface/ISlotRepository";
import {
  ISlotDTO,
  ISlotPopulatedDTO,
} from "../../types/dtos.type/slots.dto.type";
import { IMentorSlot } from "../../types/slot.type";
import { createHttpError } from "../../utils/http-error";
import { convertTo12Hour } from "../../utils/timeManagement.util";
import { ISlotService } from "../interface/ISlotService";

export class SlotService implements ISlotService {
  constructor(
    private _slotRepository: ISlotRepository,
    private _slotBookingRepository: ISlotBookingRepository,
  ) {}
  /**
   * check if there are any course exist in same mentor , same days , same time line, if there is not create new slot
   * @param slotData
   * @returns created slot document from the DB
   */
  async createSlot(slotData: IMentorSlot): Promise<ISlotDTO> {
    console.log(slotData);
    const isCourseSLotExist = await this._slotRepository.findSlotByFilter({
      courseId: slotData.courseId,
    });
    if (isCourseSLotExist) {
      throw createHttpError(HttpStatus.CONFLICT, HttpResponse.SLOT_EXIST);
    }

    const existingSlots = await this._slotRepository.getMentorSLots(
      slotData.mentorId,
    );

    if (existingSlots) {
      for (const newDay of slotData.selectedDays) {
        if (!newDay.active) continue;

        const newStart = newDay.startTime;
        const newEnd = newDay.endTime;

        for (const existingSlot of existingSlots) {
          for (const existingDay of existingSlot.selectedDays) {
            if (!existingDay.active) continue;
            if (existingDay.day !== newDay.day) continue;

            const existingStart = existingDay.startTime;
            const existingEnd = existingDay.endTime;

            const overlap = newStart < existingEnd && newEnd > existingStart;

            if (overlap) {
              throw createHttpError(
                HttpStatus.CONFLICT,
                HttpResponse.SLOT_EXIST_DAYS(
                  newDay.day,
                  `${existingDay.startTime} - ${existingDay.endTime}`,
                ),
              );
            }
          }
        }
      }
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

    const mentorSlots = await this._slotRepository.getMentorSLots(mentor_Id, [
      "courseId",
    ]);
    if (!mentorSlots) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.ITEM_NOT_FOUND);
    }

    for (let daySlots of mentorSlots) {
      for (let days of daySlots.selectedDays) {
        days.startTime = convertTo12Hour(days.startTime as string);
        days.endTime = convertTo12Hour(days.endTime as string);
      }
    }

    return mentorSlots?.map((slot) => mentorSlotsDTO(slot));
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

    const existingSlots = await this._slotRepository.getMentorSLots(
      slotData.mentorId,
    );

    if (existingSlots) {
      for (const newDay of slotData.selectedDays) {
        if (!newDay.active) continue;

        const newStart = newDay.startTime;
        const newEnd = newDay.endTime;

        for (const existingSlot of existingSlots) {
          if (existingSlot._id.toString() === slot_Id.toString()) continue;

          for (const existingDay of existingSlot.selectedDays) {
            if (!existingDay.active) continue;
            if (existingDay.day !== newDay.day) continue;

            const existingStart = existingDay.startTime;
            const existingEnd = existingDay.endTime;

            const overlap = newStart < existingEnd && newEnd > existingStart;

            if (overlap) {
              throw createHttpError(
                HttpStatus.CONFLICT,
                HttpResponse.SLOT_EXIST_DAYS(
                  newDay.day,
                  `${existingDay.startTime} - ${existingDay.endTime}`,
                ),
              );
            }
          }
        }
      }
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

    await this._slotBookingRepository.findAllSlots({
      courseId: course_Id,
      status: "booked",
    });

    for (let days of slotDAta.selectedDays) {
      days.startTime = convertTo12Hour(days.startTime as string);
      days.endTime = convertTo12Hour(days.endTime as string);
    }
    const AvtivSlot = slotDAta.selectedDays.filter((day) => day.active);

    return slotPopulatedMapper({ ...slotDAta, selectedDays: AvtivSlot });
  }
}
