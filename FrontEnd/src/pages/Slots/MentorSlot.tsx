import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CalendarDays } from "lucide-react";
import MentorSlotProfile from "@/features/slot/booking/MentorProfile";
import { useParams } from "react-router";
import { SlotService } from "@/service/mentor/slot.service";
import {
  createSlotTime,
  getSlotDatesForMentor,
} from "@/utility/generateTimes.util";
import SlotCard from "@/features/slot/booking/TimeCard";
import { useAuth } from "@/context/auth.context";
import { toast } from "sonner";
import { SlotBookingSercie } from "@/service/Learner/slotBooking.service";
import type { IMentorDTO } from "@/types/DTOS/user.dto";
import type { ISlotPopulatedDTO } from "@/types/DTOS/slot.dto";
import type { ISessionBooking } from "@/types/sessionBooking.type";

const SlotBooking: React.FC = () => {
  const [mentorProfile, setMentorProfile] = useState<IMentorDTO | null>(null);
  const [slotData, setSlotData] = useState<ISlotPopulatedDTO | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    day: string;
    startTime: string;
    endTime: string;
  } | null>(null);

  const { courseId } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      const data = await SlotService.getCourseSlot(courseId as string);
      if (data) {
        setMentorProfile(data.mentor);
        setSlotData(data);
      }
    })();
  }, [courseId]);

  const upcomingDays = useMemo(
    () => (slotData ? getSlotDatesForMentor(slotData) : []),
    [slotData],
  );

  const onBookSlot = async () => {
    if (!slotData || !selectedSlot || !user) {
      toast.error("Please select a time slot first");
      return;
    }

    try {
      const payload: ISessionBooking = {
        mentorId: slotData.mentor._id,
        date: selectedSlot.date,
        courseId: courseId as string,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        learnerId: user.id,
        slotId: slotData._id,
        status: "Pending",
        studentStatus:'pending'
      };

      const checkoutURL = await SlotBookingSercie.bookSlot(payload);
      toast.success("Slot booked successfully!");
      if (checkoutURL) window.location.href = checkoutURL;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen text-gray-900">
      <Card className="w-full max-w-5xl shadow-md border border-gray-200 bg-white rounded-2xl overflow-hidden">
        {mentorProfile && <MentorSlotProfile mentor={mentorProfile} />}

        <div className="p-6 bg-gray-50 rounded-2xl shadow-inner">
          <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2 mb-6">
            <CalendarDays className="text-orange-500" size={20} /> Available
            Slots (Next 7 Days)
          </h3>

          <div className="flex flex-col gap-6">
            {upcomingDays.map((dayObj, index) => {
              const daySlot = slotData?.selectedDays.find(
                (sd) => sd.day === dayObj.day,
              );
              if (!daySlot) return null;
              if (!slotData) return;
              const slotTimes = createSlotTime(
                slotData.slotDuration,
                daySlot.startTime,
                daySlot.endTime,
              );

              return (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-base font-semibold text-gray-900">
                        {dayObj.formattedDate}
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={14} /> {daySlot.startTime} –{" "}
                        {daySlot.endTime}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                    {slotTimes.map((time, i) => (
                      <SlotCard
                        key={i}
                        startTime={time.start}
                        endTime={time.end}
                        isSelected={
                          selectedSlot?.date === dayObj.date.toISOString() &&
                          selectedSlot?.startTime === time.start
                        }
                        onClick={() =>
                          setSelectedSlot({
                            date: dayObj.date.toISOString(),
                            day: dayObj.day,
                            startTime: time.start,
                            endTime: time.end,
                          })
                        }
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end mt-8">
            <Button
              disabled={!selectedSlot}
              onClick={onBookSlot}
              className={`rounded-xl px-6 py-2 font-semibold text-white shadow-sm transition-all duration-200 ${
                selectedSlot ? "bg-black hover:bg-gray-900" : "bg-gray-400"
              }`}
            >
              Confirm Booking
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SlotBooking;
