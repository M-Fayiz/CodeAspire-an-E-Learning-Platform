import { Input } from "@/components/ui/Inputs";
import type { IMentorSlot, ISlotDays } from "@/types/slot.types";
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
import { useAuth } from "@/context/auth.context";
import { SlotDurationOptions } from "@/constants/slotManagment.const";

import { SelectField } from "@/components/ui/selectField";
import { generateTimeOptions } from "@/utility/generateTimes.util";

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
  const days: ISlotDays[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const { user } = useAuth();

  const [courses, setCourses] = useState<SlotCourseDTO[]>([]);
  useEffect(() => {
    (async () => {
      const data = await courseService.listCourseOnSlot(user!.id);
      if (data) {
        setCourses(data);
      }
    })();
  }, []);

  const toggleDaySelection = (day: ISlotDays) => {
    setFormData((prev) => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day],
    }));
  };
  console.log("form DAta ", formData);

  const TimeOfSlots = useMemo(() => {
    return generateTimeOptions(formData.slotDuration);
  }, [formData.slotDuration]);
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
          <SelectTrigger className="w-full h-11 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400">
            <SelectValue placeholder="Select your Course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course._id} value={course._id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formError.courseId && (
          <p className="text-red-500 text-sm py-1">{formError.courseId}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Select Days <span className="text-red-600">*</span>
        </label>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDaySelection(day)}
              className={`py-2 px-3 border rounded-lg text-sm font-medium transition-all duration-200 ${
                formData.selectedDays.includes(day)
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
        {formError.selectedDays && (
          <p className="text-red-500 text-sm py-1">{formError.selectedDays}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Session Duration <span className="text-red-600">*</span>
          </label>

          <SelectField
            label=""
            placeholder="Select duration"
            value={formData.slotDuration}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, slotDuration: Number(value) }))
            }
            options={SlotDurationOptions}
          />
          {formError.slotDuration && (
            <p className="text-red-500 text-sm py-1">
              {formError.slotDuration}
            </p>
          )}
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
              setFormData({ ...formData, pricePerSlot: Number(e.target.value) })
            }
            required
          />
          {formError.pricePerSlot && (
            <p className="text-red-500 text-sm py-1">
              {formError.pricePerSlot}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Start Time <span className="text-red-600">*</span>
          </label>
          <Select
            value={formData.startTime}
            onValueChange={(value) =>
              setFormData({ ...formData, startTime: value })
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

          {formError.startTime && (
            <p className="text-red-500 text-sm py-1">{formError.startTime}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            End Time <span className="text-red-600">*</span>
          </label>
          <Select
            value={formData.endTime}
            onValueChange={(value) =>
              setFormData({ ...formData, endTime: value })
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
          {formError.endTime && (
            <p className="text-red-500 text-sm py-1">{formError.endTime}</p>
          )}
        </div>
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
