import { PipelineStage, Types } from "mongoose";
import { HttpResponse } from "../../const/error-message.const";
import { HttpStatus } from "../../const/http-status.const";
import { createdSlotsDTO, mentorSlotsDTO, slotPopulatedMapper } from "../../dtos/slot.dto";
import { ISlotModel } from "../../models/slot.model";
import { parseObjectId } from "../../mongoose/objectId";
import { ICourseRepository } from "../../repository/interface/ICourseRepository";
import { ISlotBookingRepository } from "../../repository/interface/ISlotBookingRepository";
import { ISlotRepository } from "../../repository/interface/ISlotRepository";
import {
  ISlotDTO,
  ISlotPopulatedDTO,
  mentorUnPopulatedSlots,
} from "../../types/dtos.type/slots.dto.type";
import { IMentorSlot } from "../../types/slot.type";
import { createHttpError } from "../../utils/http-error";
import { convertTo12Hour, isSlotTimingChanged } from "../../utils/timeManagement.util";
import { ISlotService } from "../interface/ISlotService";


export class SlotService implements ISlotService {
  constructor(
    private _slotRepository: ISlotRepository,
    private _slotBookingRepository: ISlotBookingRepository,
    private _courseRepositoy: ICourseRepository,
  ) {}
  private async _validateSlotOverlap(
    mentorId: Types.ObjectId,
    selectedDays: IMentorSlot["selectedDays"],
    existingSlotForUpdation?:mentorUnPopulatedSlots[]
  ) {
    let existingSlots
    if(!existingSlotForUpdation){
      existingSlots = await this._slotRepository.getMentorSLots(mentorId);
    }else{
      existingSlots=existingSlotForUpdation
    }

    if (!existingSlots) return;

    for (const newDay of selectedDays) {
      if (!newDay.active) continue;

      for (const slot of existingSlots) {
        for (const existingDay of slot.selectedDays) {
          if (!existingDay.active) continue;
          if (existingDay.day !== newDay.day) continue;

          if (
            newDay.startTime < existingDay.endTime &&
            newDay.endTime > existingDay.startTime
          ) {
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

  /**
   * check if there are any course exist in same mentor , same days , same time line, if there is not create new slot
   * @param slotData
   * @returns created slot document from the DB
   */
  async createSlot(slotData: IMentorSlot): Promise<ISlotDTO> {
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
      await this._validateSlotOverlap(slotData.mentorId, slotData.selectedDays);
    }
   
    const createdSlot = await this._slotRepository.createSlot(slotData);

    const updatedCourse = await this._slotRepository.getUpdateSlots(
      createdSlot._id,
      ["courseId"],
    );

    if (!updatedCourse) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.SLOT_NOT_FOUND);
    }
    
    for (let days of updatedCourse.selectedDays) {
      days.startTime = convertTo12Hour(days.startTime as string);
      days.endTime = convertTo12Hour(days.endTime as string);
    }
    return createdSlotsDTO(updatedCourse);
  }
  /**
   * fetch mentor's slot data
   * @param mentorId
   * @returns array of mapped slot data
   */
  async getMontorSlots(
    mentorId: string,
    page: number,
    search: string,
    filter: string,
  ): Promise<{ mappedSlots: ISlotDTO[]; totalDocument: number }> {
    const mentor_Id = parseObjectId(mentorId);
    if (!mentor_Id) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.INVALID_ID);
    }
    let limit = 5;
    let skip = (page - 1) * limit;

    const pipeline: PipelineStage[] = [
      {
        $match: {
          mentorId: mentor_Id,
          isActive: true,
        },
      },
    ];

    if (filter) {
      pipeline.push({
        $match: {
          selectedDays: {
            $elemMatch: {
              day: filter,
              active: true,
            },
          },
        },
      });
    }

    pipeline.push(
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
    );

    if (search) {
      pipeline.push({
        $match: {
          "course.title": {
            $regex: search,
            $options: "i",
          },
        },
      });
    }

    pipeline.push({ $skip: skip }, { $limit: limit });

    const mentorSlots = await this._slotRepository.getMentorSLotsList(pipeline);

    if (!mentorSlots) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.ITEM_NOT_FOUND);
    }
    const totalDocument = await this._slotRepository.totalDocument({
      mentorId: mentor_Id,
    });

    for (let daySlots of mentorSlots) {
      for (let days of daySlots.selectedDays) {
        days.startTime = convertTo12Hour(days.startTime as string);
        days.endTime = convertTo12Hour(days.endTime as string);
      }
    }
    const mappedSlots = mentorSlots?.map((slot) => mentorSlotsDTO(slot));
    return { mappedSlots, totalDocument };
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

    const existingSlot = await this._slotRepository.findSlotByFilter({_id:slot_Id});

        if (!existingSlot) {
          throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.ITEM_NOT_FOUND);
        }
        const timingChanged = isSlotTimingChanged(
          existingSlot.selectedDays,
          slotData.selectedDays
        );
          if (timingChanged) {
        const existingSlots = await this._slotRepository.getMentorSLots(
          slotData.mentorId,
        );

        const exceptCurrentSlot = existingSlots?.filter(
          (slot) => !slot._id.equals(slot_Id)
        );

        if (exceptCurrentSlot?.length) {
          await this._validateSlotOverlap(
            slotData.mentorId,
            slotData.selectedDays,
            exceptCurrentSlot
          );
        }
}

    const updatedSlot = await this._slotRepository.updateSlot(
      slot_Id,
      slotData,
    );

    if (!updatedSlot) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.ITEM_NOT_FOUND);
    }

    const updatedCourse = await this._slotRepository.getUpdateSlots(
      updatedSlot._id,
      ["courseId"],
    );

    if (!updatedCourse) {
      throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.SLOT_NOT_FOUND);
    }

    for (let days of updatedCourse.selectedDays) {
      days.startTime = convertTo12Hour(days.startTime as string);
      days.endTime = convertTo12Hour(days.endTime as string);
    }
    return createdSlotsDTO(updatedCourse);
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
