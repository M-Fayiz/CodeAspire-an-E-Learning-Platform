import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal } from "lucide-react";

interface MentorActionMenuProps {
  slot: any;
  onViewFeedback: (slot: any) => void;
  onSaveFeedback: (slotId: string, feedback: string) => void;
  onStudentStatusUpdate: (slotId: string, status: "passed" | "failed") => void;
  onSessionComplete: (slotId: string, sessionStatus: "completed") => void;
}

export const MentorActionMenu: React.FC<MentorActionMenuProps> = ({
  slot,
  onViewFeedback,
  onSaveFeedback,
  onStudentStatusUpdate,
  onSessionComplete,
}) => {
  const [openDialog, setOpenDialog] = useState<
    "feedback" | "student-status" | "session-status" | null
  >(null);

  const [feedback, setFeedback] = useState(slot.feedback || "");
  const [selectedStudentStatus, setSelectedStudentStatus] = useState<
    "passed" | "failed" | null
  >(null);

  const handleSaveFeedback = () => {
    onSaveFeedback(slot._id, feedback);
    setOpenDialog(null);
  };

  const handleUpdateStudentStatus = () => {
    if (selectedStudentStatus) {
      onStudentStatusUpdate(slot._id, selectedStudentStatus);
      setOpenDialog(null);
    }
  };

  const handleSessionComplete = () => {
    onSessionComplete(slot._id, "completed");
    setOpenDialog(null);
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" aria-label="Open menu">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-52" align="end">
          <DropdownMenuLabel>Session Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => onViewFeedback(slot)}>
              View Feedback
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setOpenDialog("feedback")}>
              Add / Edit Feedback
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setOpenDialog("student-status")}>
              Update Student Status
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setOpenDialog("session-status")}>
              Mark Session Complete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={openDialog === "feedback"}
        onOpenChange={() => setOpenDialog(null)}
      >
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>
              {slot.feedback ? "Edit Feedback" : "Add Feedback"}
            </DialogTitle>
            <DialogDescription>
              Write feedback for this learner’s session.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Type feedback here..."
            className="min-h-[120px]"
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={() => {
                handleSaveFeedback();
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDialog === "student-status"}
        onOpenChange={() => setOpenDialog(null)}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Update Student Status</DialogTitle>
            <DialogDescription>
              Mark learner as Passed or Failed.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-3 py-4 justify-center">
            <Button
              variant={
                selectedStudentStatus === "passed" ? "default" : "outline"
              }
              onClick={() => setSelectedStudentStatus("passed")}
            >
              ✅ Passed
            </Button>
            <Button
              variant={
                selectedStudentStatus === "failed" ? "destructive" : "outline"
              }
              onClick={() => setSelectedStudentStatus("failed")}
            >
              ❌ Failed
            </Button>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleUpdateStudentStatus}
              disabled={!selectedStudentStatus}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* === Mark Session Complete Dialog === */}
      <Dialog
        open={openDialog === "session-status"}
        onOpenChange={() => setOpenDialog(null)}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Mark Session as Completed</DialogTitle>
            <DialogDescription>
              Confirm this session has been completed.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center py-4">
            <Button onClick={handleSessionComplete}>✅ Complete Session</Button>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
