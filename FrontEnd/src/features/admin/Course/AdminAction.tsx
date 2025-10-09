import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CheckCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/Inputs";

interface AdminCourseActionsProps {

  onAppprove: () => Promise<void>;
  status: "inProgress" | "draft" | "published" | "approved" | "rejected";
  onReject: (feedBack: string) => Promise<void>;
}

export default function AdminCourseActions({

  onAppprove,
  status,
  onReject,
}: AdminCourseActionsProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ feedBack: "" });
  const [error, setErros] = useState({ feedBack: "" });
  const handleApprove = async () => {
    setLoading(true);
    await onAppprove();
    setLoading(false);
  };
  const handleInput = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleReject = async () => {
    setLoading(true);
    if (form.feedBack.trim() == "") {
      setErros({ feedBack: "please give a reason..." });
      return;
    }
    onReject(form.feedBack);
    setForm({feedBack:''})
    setLoading(false);
  };

  return (
    <div className="flex gap-3">
      <div className=" flex gap-5 p-10">
        {status !== "approved" && (
          <Button
            onClick={handleApprove}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-green-700 hover:bg-green-600 shadow-md"
          >
            <CheckCircle className="w-4 h-4" />
            {loading ? "Processing..." : "Approve"}
          </Button>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg shadow-md"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject this course?</AlertDialogTitle>
              <AlertDialogDescription>
                <Input
                  name="feedBack"
                  textArea
                  onChange={handleInput}
                  value={form.feedBack}
                  error={error.feedBack}
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleReject}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm Reject
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
