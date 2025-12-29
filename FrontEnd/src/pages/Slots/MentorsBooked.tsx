"use client";

import { useAuth } from "@/context/auth.context";
import { BookingTable } from "@/features/slot/listing/bookingTable";
import { SlotBookingSercie } from "@/service/Learner/slotBooking.service";
import VideoService from "@/service/videoSession.service";
import type {
  IBookingDTOforLearner,
  slotStatus,
} from "@/types/DTOS/slotBooking.dto.type";
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
import { CalendarDays, Search } from "lucide-react";
import CertificateService from "@/service/certificate.service";
import type { studentStatus } from "@/types/sessionBooking.type";
import ManagementLayout from "@/components/layout/ManagementLayout";
import PaginationRounded from "@/components/ui/Pagination";
import { useSearchPagination } from "@/hooks/useSearchQuery";
import { DateFilter } from "@/components/common/DateFilter";
import type { DateRange } from "react-day-picker";
import { ApiError } from "@/utility/apiError.util";

export default function MentorBookedSlots() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [mentorSlots, setMentorSlots] = useState<IBookingDTOforLearner[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [slots, setSlots] = useState<IBookingDTOforLearner | null>(null);
  const [value, setValue] = useState<Date | DateRange | undefined>();
  const [showDateFilter, setShowDateFilter] = useState(false);

  const { setFilter, filter, search, setSearch, page, setPage } =
    useSearchPagination();

  const [totalPage, setTotalPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (!user?.id) return;

    (async () => {
      try {
        setLoading(true);
        const data = await SlotBookingSercie.getBookedMentorSlotList(user.id);
        setMentorSlots(data);
      } catch {
        toast.error("Failed to fetch mentor slots");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  const handleJoinSession = async (slot: IBookingDTOforLearner) => {
    try {
      const result = await VideoService.startVideoSession(slot._id);
      if (result.roomId) {
        navigate(`/mentor/video-session/${result.roomId}`);
      }
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
    }
  };

  const handleViewFeedback = (slot: IBookingDTOforLearner) => {
    setSlots(slot);
    setOpen(true);
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
    } catch {
      toast.error("Failed to save feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (slotId: string, status: studentStatus) => {
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
    } catch {
      toast.error("Failed to update student status");
    } finally {
      setLoading(false);
    }
  };

  const handleSessionComplete = async (
    slotId: string,
    sessionStatus: slotStatus,
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
    } catch {
      toast.error("Failed to mark session complete");
    } finally {
      setLoading(false);
    }
  };

  const onCertificateIssue = async (
    learnerId: string,
    courseId: string,
    title: string,
  ) => {
    const result = await CertificateService.generateCertificate(
      courseId,
      learnerId,
      title,
    );
    if (result) toast.success("Certificate generated successfully");
  };

  return (
    <ManagementLayout
      title="Booked Slots List"
      description="Manage slots"
      icon={<CalendarDays size={40} className="text-gray-800" />}
    >
      <div className="flex flex-col gap-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => setShowDateFilter((prev) => !prev)}
          >
            {showDateFilter ? "Hide Date Filter" : "Filter by Date"}
          </Button>

          {showDateFilter && (
            <DateFilter mode="single" value={value} onChange={setValue} />
          )}

          <div className="flex items-center gap-2 rounded-md border bg-white px-3 py-2 shadow-sm">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search slots..."
              className="w-64 text-sm outline-none"
            />
          </div>
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
          onCertificateIssue={onCertificateIssue}
        />

        {/* 💬 Feedback Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Feedback</DialogTitle>
              <DialogDescription>
                {slots?.courseId.title
                  ? `Feedback for ${slots.courseId.title}`
                  : "Feedback details for this session."}
              </DialogDescription>
            </DialogHeader>

            <div className="bg-gray-50 border rounded-md p-4 text-gray-800 whitespace-pre-wrap min-h-[100px]">
              {slots?.feedback ?? "No feedback available yet."}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <PaginationRounded
          currentPage={page}
          totalPages={totalPage}
          onPageChange={(_, value) => setPage(value)}
        />
      </div>
    </ManagementLayout>
  );
}
