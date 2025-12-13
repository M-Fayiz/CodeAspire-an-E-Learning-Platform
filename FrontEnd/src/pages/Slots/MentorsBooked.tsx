"use client";

import { useAuth } from "@/context/auth.context";
import { BookingTable } from "@/features/slot/listing/bookingTable";
import { SlotBookingSercie } from "@/service/Learner/slotBooking.service";
import VideoService from "@/service/videoSession.service";
import type { IBookingDTOforLearner } from "@/types/DTOS/slotBooking.dto.type";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";

export default function MentorBookedSlots() {
  const { user } = useAuth();
  const [mentorSlots, setMentorSlots] = useState<IBookingDTOforLearner[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOPen] = useState(false);
  const [slots, setSlots] = useState<IBookingDTOforLearner | null>(null);
  useEffect(() => {
    if (!user?.id) return;

    (async () => {
      try {
        setLoading(true);
        const data = await SlotBookingSercie.getBookedMentorSlotList(user.id);
        setMentorSlots(data);
      } catch (error) {
        toast.error("Failed to fetch mentor slots");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const navigate = useNavigate();
  const handleJoinSession = async (slot: IBookingDTOforLearner) => {
    try {
      const restult = await VideoService.startVideoSession(slot._id);
      if (restult.roomId) {
        navigate(`/mentor/video-session/${restult.roomId}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleViewFeedback = (slot: IBookingDTOforLearner) => {
    setSlots(slot);
    setOPen(true);
  };

  const handleSaveFeedback = async (slotId: string, feedback: string) => {
    try {
      setLoading(true);

      const result = await SlotBookingSercie.addFeedback(slotId, feedback);

      if (result) {
        setMentorSlots((prev) =>
          prev.map((s) =>
            s._id === result.bookedId
              ? { ...s, feedback: result.feedback, status: "completed" }
              : s,
          ),
        );
        toast.success("Feedback saved successfully!");
      }
    } catch (error) {
      toast.error("Failed to save feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    slotId: string,
    status: "passed" | "failed",
  ) => {
    try {
      setLoading(true);
      const updateStatus = await SlotBookingSercie.updateStudentStatus(
        slotId,
        status,
      );
      if (updateStatus) {
        setMentorSlots((prev) =>
          prev.map((s) =>
            s._id === updateStatus.bookedId
              ? { ...s, studentStatus: updateStatus.status }
              : s,
          ),
        );
      }
      toast.success(`Student marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update student status");
    } finally {
      setLoading(false);
    }
  };

  const handleSessionComplete = async (
    slotId: string,
    sessionStatus: "completed",
  ) => {
    try {
      setLoading(true);
      const updatedStatus = await SlotBookingSercie.updateBookedSlotStatus(
        slotId,
        sessionStatus,
      );
      if (updatedStatus) {
        setMentorSlots((prev) =>
          prev.map((s) =>
            s._id === updatedStatus.bookedId
              ? { ...s, status: updatedStatus.status }
              : s,
          ),
        );
      }

      toast.success("Session marked as completed!");
    } catch (error) {
      toast.error("Failed to mark session complete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 max-w-7xl mx-auto">
      <div className=" bg-black p-5 rounded-lg flex justify-between  ">
        <div className="flex align-middle gap-2.5">
          <CalendarDays color="white" />
          <h1 className="text-2xl font-bold text-white">Booked Sessions</h1>
        </div>
        <div></div>
      </div>
      <BookingTable
        role="mentor"
        slots={mentorSlots}
        loading={loading}
        onJoinSession={handleJoinSession}
        onViewFeedback={handleViewFeedback}
        onAddFeedback={handleSaveFeedback}
        onUpdateStatus={(slot, status) =>
          handleUpdateStatus(slot._id.toString(), status)
        }
        onSessionComplete={handleSessionComplete}
      />
      <Dialog open={open} onOpenChange={setOPen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Feedback</DialogTitle>
            <DialogDescription>
              {slots?.courseId.title
                ? `Feedback for ${slots?.courseId.title}`
                : "Feedback details for this session."}
            </DialogDescription>
          </DialogHeader>

          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mt-3 text-gray-800 whitespace-pre-wrap min-h-[100px]">
            {slots?.feedback ? slots?.feedback : "No feedback available yet."}
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
