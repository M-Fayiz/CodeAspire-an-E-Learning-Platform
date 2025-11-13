import { Button } from "@/components/ui/button";
import { Book, User, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { IBookingDTOforLearner } from "@/types/DTOS/slotBooking.dto.type";
import { MentorActionMenu } from "@/features/mentor/slots/mentorActions";

interface BookingTableProps {
  role: "learner" | "mentor";
  slots: IBookingDTOforLearner[];
  loading?: boolean;

  onJoinSession?: (slot: IBookingDTOforLearner) => void;
  onViewFeedback?: (slot: IBookingDTOforLearner) => void;

  onAddFeedback?: (slotId: string, feedback: string) => void;
  onUpdateStatus?: (
    slot: IBookingDTOforLearner,
    status: "passed" | "failed",
  ) => void;
  onSessionComplete?: (slotId: string, status: "completed") => void;
}

export const BookingTable = ({
  role,
  slots,
  loading,
  onJoinSession,
  onViewFeedback,
  onAddFeedback,
  onUpdateStatus,
  onSessionComplete,
}: BookingTableProps) => {
  if (slots.length === 0) {
    return (
      <Card className="bg-white border border-gray-200 text-black shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2 text-gray-800">
            <Clock size={20} className="text-gray-600" /> Booked Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-600 text-center py-8">
            No booked sessions found.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200 text-black shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold flex items-center gap-2 text-gray-800">
          <Clock size={20} className="text-gray-600" /> Booked Sessions
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left font-medium min-w-[120px]">
                  Course
                </th>
                <th className="p-3 text-left font-medium min-w-[100px]">
                  {role === "learner" ? "Mentor" : "Student"}
                </th>
                <th className="p-3 text-left font-medium">Date</th>
                <th className="p-3 text-left font-medium">Time</th>
                <th className="p-3 text-left font-medium">Type</th>
                <th className="p-3 text-left font-medium">Status</th>
                <th className="p-3 text-left font-medium">Student Status</th>
                <th className="p-3 text-left font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {slots.map((slot) => (
                <tr
                  key={slot._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 text-gray-800">
                    <div className="flex items-center gap-2">
                      <Book size={16} className="text-gray-500" />
                      {slot.courseId?.title || "Untitled Course"}
                    </div>
                  </td>

                  <td className="p-3 text-gray-700">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-500" />
                      {role === "learner"
                        ? slot.mentorId?.name || "Unknown Mentor"
                        : slot.learnerId?.name || "Unknown Student"}
                    </div>
                  </td>

                  <td className="p-3 text-gray-700">
                    {new Date(slot.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td className="p-3 text-gray-700">
                    {slot.startTime as string} – {slot.endTime as string}
                  </td>

                  <td className="p-3 text-gray-700 capitalize">{slot.type}</td>

                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        slot.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : slot.status === "booked"
                            ? "bg-blue-100 text-blue-800"
                            : slot.status === "canceled"
                              ? "bg-red-100 text-red-700"
                              : slot.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {slot.status}
                    </span>
                  </td>

                  <td className="p-3 text-center capitalize">
                    {slot.studentStatus || "-"}
                  </td>

                  <td className="p-3 flex gap-2 justify-center">
                    {role === "learner" && (
                      <>
                        {slot.status === "booked" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onJoinSession?.(slot)}
                            disabled={loading}
                          >
                            <Clock size={14} className="mr-1" /> Join
                          </Button>
                        )}

                        {slot.status === "completed" && slot.feedback && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewFeedback?.(slot)}
                          >
                            View Feedback
                          </Button>
                        )}
                      </>
                    )}

                    {role === "mentor" && (
                      <>
                        {slot.status === "booked" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onJoinSession?.(slot)}
                            disabled={loading}
                          >
                            <Clock size={14} className="mr-1" /> Join
                          </Button>
                        )}

                        <MentorActionMenu
                          slot={slot}
                          onViewFeedback={onViewFeedback || (() => {})}
                          onSaveFeedback={(slotId, fb) =>
                            onAddFeedback?.(slotId, fb)
                          }
                          onStudentStatusUpdate={(slotId, st) =>
                            onUpdateStatus?.({ ...slot, _id: slotId }, st)
                          }
                          onSessionComplete={(slotId, status) =>
                            onSessionComplete?.(slotId, status)
                          }
                        />
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
