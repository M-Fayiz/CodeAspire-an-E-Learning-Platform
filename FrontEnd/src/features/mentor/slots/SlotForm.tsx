import { Input } from "@/components/ui/Inputs";
import type { Days, IMentorSlot, SlotDay } from "@/types/slot.types";
import React, { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import courseService from "@/service/mentor/course.service";
import type { SlotCourseDTO } from "@/types/DTOS/courses.dto.types";
import { SlotDurationOptions } from "@/constants/slotManagment.const";
import { SelectField } from "@/components/ui/selectField";
import {
  convertTo24Hour,
  generateTimeOptions,
} from "@/utility/generateTimes.util";
import { Checkbox } from "@/components/ui/checkbox";

interface SlotBookingFormProps {
  formData: IMentorSlot;
  setFormData: React.Dispatch<React.SetStateAction<IMentorSlot>>;
  formError: Partial<Record<keyof IMentorSlot, string>>;
}

const SlotBookingForm: React.FC<SlotBookingFormProps> = ({
  formData,
  setFormData,
  formError,
}) => {

  const [courses, setCourses] = useState<SlotCourseDTO[]>([]);
  useEffect(() => {
    (async () => {
      const data = await courseService.listCourseOnSlot();
      if (data) setCourses(data);
    })();
  }, []);

  const TimeOfSlots = useMemo(
    () => generateTimeOptions(formData.slotDuration),
    [formData.slotDuration],
  );

  const updateDayField = (
    day: Days,
    field: keyof SlotDay,
    value: string | boolean,
  ) => {
    const updated = formData.selectedDays.map((d) =>
      d.day === day ? { ...d, [field]: value } : d,
    );

    setFormData({ ...formData, selectedDays: updated });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Course <span className="text-red-600">*</span>
        </label>
        <Select
          value={formData.courseId}
          onValueChange={(value) =>
            setFormData({ ...formData, courseId: value })
          }
        >
          <SelectTrigger className="w-full border border-gray-300 rounded-lg bg-white text-gray-900">
            <SelectValue placeholder="Select your Course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course._id} value={course._id} className="h-11">
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formError.courseId && (
          <p className="text-red-500 text-sm py-1">{formError.courseId}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Session Duration <span className="text-red-600">*</span>
          </label>
          <SelectField
            placeholder="Select duration"
            value={formData.slotDuration}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                slotDuration: Number(value),
              }))
            }
            options={SlotDurationOptions}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Session Price <span className="text-red-600">*</span>
          </label>
          <Input
            type="number"
            min="1"
            value={formData.pricePerSlot}
            onChange={(e) =>
              setFormData({
                ...formData,
                pricePerSlot: Number(e.target.value),
              })
            }
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Select Days <span className="text-red-600">*</span>
        </label>
      
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formData.selectedDays.map((slotDay) => (
          <div
            key={slotDay.day}
            className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3"
          >
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-800">{slotDay.day}</h4>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={slotDay.active}
                  onCheckedChange={(checked) =>
                    updateDayField(slotDay.day, "active", Boolean(checked))
                  }
                />

                <label className="text-sm text-gray-700">Enable</label>
              </div>
            </div>

      
            <div className="grid grid-cols-2 gap-4">
             
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Start Time
                </label>
                <Select
                  value={slotDay.startTime}
                  onValueChange={(value) =>
                    updateDayField(slotDay.day, "startTime", value)
                  }
                >
                  <SelectTrigger className="w-full h-11 border border-gray-300 rounded-lg bg-white text-gray-900">
                    <SelectValue placeholder="Start Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TimeOfSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  End Time
                </label>
                <Select
                  value={slotDay.endTime}
                  onValueChange={(value) =>
                    updateDayField(slotDay.day, "endTime", value)
                  }
                >
                  <SelectTrigger className="w-full h-11 border border-gray-300 rounded-lg bg-white text-gray-900">
                    <SelectValue placeholder="End Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TimeOfSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {slotDay.startTime &&
                slotDay.endTime &&
                convertTo24Hour(slotDay.startTime) >=
                  convertTo24Hour(slotDay.endTime) && (
                  <p className="text-red-500 text-[14px]">
                    please Select a valid Time Range
                  </p>
                )}
              {/* {formError[slotDay.day] && (
              <p className="text-red-500 text-xs">{formError[slotDay.day]}</p>
            )} */}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-sm text-gray-600">
          <strong>Note:</strong> The system automatically prevents overlapping
          slots.
        </p>
      </div>
    </div>
  );
};

export default SlotBookingForm;
