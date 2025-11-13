import { useAuth } from "@/context/auth.context";

import { BookingTable } from "@/features/slot/listing/bookingTable";
import { SlotBookingSercie } from "@/service/Learner/slotBooking.service";
import type { IBookingDTOforLearner } from "@/types/DTOS/slotBooking.dto.type";
import { useEffect, useState } from "react";
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
import { useNavigate } from "react-router";
import VideoService from "@/service/videoSession.service";
import { toast } from "sonner";

export default function LearnerBookedSlots() {
  const [learnerSlots, setLearnerSlots] = useState<IBookingDTOforLearner[]>([]);
  const [open, setOPen] = useState(false);
  const [slots, setSlots] = useState<IBookingDTOforLearner | null>(null);
  const { user } = useAuth();
  useEffect(() => {
    (async () => {
      const data = await SlotBookingSercie.getUserBookingList(user!.id);
      setLearnerSlots(data);
    })();
  }, []);

  const handleViewFeedback = (slot: IBookingDTOforLearner) => {
    setSlots(slot);
    setOPen(true);
  };

  const navigate = useNavigate();
  const handleJoinSession = async (slot: IBookingDTOforLearner) => {
    try {
      const restult = await VideoService.startVideoSession(slot._id);
      if (restult.roomId) {
        navigate(`/learner/video-session/${restult.roomId}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <BookingTable
        role="learner"
        slots={learnerSlots}
        onJoinSession={handleJoinSession}
        onViewFeedback={handleViewFeedback}
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
