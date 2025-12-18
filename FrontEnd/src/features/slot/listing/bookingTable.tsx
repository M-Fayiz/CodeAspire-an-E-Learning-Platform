import { Button } from "@/components/ui/button";
import { Book, User, Clock, Award } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import type { IBookingDTOforLearner } from "@/types/DTOS/slotBooking.dto.type";
import { MentorActionMenu } from "@/features/mentor/slots/mentorActions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { useState } from "react";

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
  onCertificateIssue?:(learnerId:string,courseId:string,programmTitle:string)=>void
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
  onCertificateIssue
}: BookingTableProps) => {
  const [title,setTitle]=useState('')
  const [errors, setErrors] = useState('');
  const [open, setOpen] = useState(false);

  const onSubmitCrtfct=(courseId:string,learnerId:string,e:React.FormEvent<HTMLFormElement>)=>{  
    e.preventDefault()
    if(title.trim()==''){
      setErrors('please provide programm title')
      return
    }
    if(title.length>200){
      setErrors('please provide programm title less than 200 letter')
      return
    }

    onCertificateIssue?.(learnerId,courseId,title)
    setTitle('')
    setErrors('')
  }
  if (slots.length === 0) {
    return (
      <Card className="bg-white border border-gray-200 text-black shadow-sm">
        <CardHeader></CardHeader>
        <CardContent>
          <div className="text-gray-600 text-center py-8">
            No booked sessions found.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardContent className="p-4">

        {/* ===================== DESKTOP TABLE ===================== */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Course</th>
                <th className="px-4 py-3 text-left font-medium">
                  {role === "learner" ? "Mentor" : "Student"}
                </th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Time</th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
                <th className="px-4 py-3 text-center font-medium">Status</th>
                <th className="px-4 py-3 text-center font-medium">
                  Student Status
                </th>
                <th className="px-4 py-3 text-center font-medium">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {slots.map((slot) => (
                <tr
                  key={slot._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Book size={16} className="text-gray-500" />
                      {slot.courseId?.title || "Untitled Course"}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-500" />
                      {role === "learner"
                        ? slot.mentorId?.name || "Unknown Mentor"
                        : slot.learnerId?.name || "Unknown Student"}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {new Date(slot.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    {slot.startTime as string} – {slot.endTime as string}
                  </td>

                  <td className="px-4 py-3 capitalize">
                    {slot.type}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        slot.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : slot.status === "booked"
                          ? "bg-blue-100 text-blue-800"
                          : slot.status === "canceled"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {slot.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center capitalize">
                    {slot.studentStatus || "-"}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      {slot.status === "booked" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onJoinSession?.(slot)}
                          disabled={loading}
                        >
                          <Clock size={14} className="mr-1" />
                          Join
                        </Button>
                      )}

                      {role === "mentor" &&
                        slot.studentStatus === "passed" && (
                          <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Award size={14} className="mr-1" />
                                Certificate
                              </Button>
                            </DialogTrigger>

                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Program Title</DialogTitle>
                                <DialogDescription>
                                Enter the program or course name that will be displayed on the
                                learner’s certificate.
                              </DialogDescription>
                              </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <div className="space-y-1">
                              <label className="text-sm font-medium text-gray-700">
                                Program / Course Title
                              </label>
                              <Input value={title} onChange={(e)=>setTitle(e.target.value)}
                                placeholder="e.g. Full Stack Web Development"
                              />
                            </div>
                            <p className="text-red-500">{errors}</p>
                            <div className="flex justify-end gap-2 pt-2">
                              <DialogClose asChild>
                                <Button variant="outline">
                                  Cancel
                                </Button>
                              </DialogClose>

                              <form onSubmit={(e) => onSubmitCrtfct(slot.courseId._id, slot.learnerId._id, e)}>
                                <Button type="submit" >
                                  Generate Certificate
                                </Button>
                              </form>

                            </div>
                          </div>
                            </DialogContent>
                          </Dialog>
                        )}

                      {role === "mentor" && ( 
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
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===================== MOBILE CARD VIEW ===================== */}
        <div className="md:hidden space-y-4">
          {slots.map((slot) => (
            <div
              key={slot._id}
              className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex items-center gap-2 font-medium">
                <Book size={16} />
                {slot.courseId?.title || "Untitled Course"}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                <User size={14} />
                {role === "learner"
                  ? slot.mentorId?.name || "Unknown Mentor"
                  : slot.learnerId?.name || "Unknown Student"}
              </div>

              <div className="text-sm text-gray-600 mt-2">
                📅{" "}
                {new Date(slot.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>

              <div className="text-sm text-gray-600">
                ⏰ {slot.startTime as string} – {slot.endTime as string}
              </div>

              <div className="flex justify-between items-center mt-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    slot.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : slot.status === "booked"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {slot.status}
                </span>

                <span className="text-xs capitalize text-gray-600">
                  {slot.studentStatus || "-"}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {slot.status === "booked" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onJoinSession?.(slot)}
                    disabled={loading}
                  >
                    <Clock size={14} className="mr-1" />
                    Join
                  </Button>
                )}

                {role === "mentor" && (
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
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );;

};
