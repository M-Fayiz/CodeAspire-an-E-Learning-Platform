import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Inputs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCourseFormContext } from "@/context/courseForm.context";
import { lectureSchema } from "@/schema/courseForm.schema";
import courseService from "@/service/mentor/course.service";
import type { ILecture } from "@/types/DTOS/courses.dto.types";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface AddLectureProps {
  closeSheet: () => void;
  courseId: string;
  sessionId: string;
}

export function AddLecture({
  closeSheet,
  courseId,
  sessionId,
}: AddLectureProps) {
  const [lecture, setLecture] = useState<ILecture>({
    title: "",
    lectureType: "none",
    lectureContent: "",
  });
  const [videoURL, setVideoURL] = useState("");
  const [spin, setSpin] = useState(false);
  const [errors, setErros] = useState<{ [key: string]: string }>({});
  const { addSession } = useCourseFormContext();
  const handleLectureChage = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, type, value } = e.target;
    setLecture((prv) => ({
      ...prv,
      [name]:
        type == "file" ? (e.target as HTMLInputElement).files?.[0] : value,
    }));
  };
  useEffect(() => {
    if (!lecture?.lectureContent) {
      return;
    }

    if (lecture.lectureContent instanceof File) {
      const URLobject = URL.createObjectURL(lecture.lectureContent);
      setVideoURL(URLobject);

      return () => {
        URL.revokeObjectURL(URLobject);
      };
    }
  }, [lecture?.lectureContent]);

  const saveLecture = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let fieldErros: Record<string, string> = {};
      const result = lectureSchema.safeParse(lecture);
      if (!result.success) {
        result.error.issues.forEach((err) => {
          let fieldName = err.path.join(".");
          fieldErros[fieldName] = err.message;
        });
        setErros(fieldErros);
        return;
      }

      setSpin(true);
      const updatedCourseData = await courseService.addLecture(
        courseId,
        sessionId,
        lecture,
      );
      if (updatedCourseData) {
        addSession(updatedCourseData.sessions);
        setSpin(false);
        closeSheet();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        setSpin(false);
      }
    }
  };

  return (
    <div className="p-3 flex flex-col gap-2.5">
      <Input
        label="Lecture Title"
        placeholder="insert lecture title"
        type="text"
        name="title"
        value={lecture.title}
        onChange={handleLectureChage}
        error={errors.title}
      />
      <div>
        <label className="font-semibold text-gray-600">
          Select Lecture Content type
        </label>
        <Select
          value={lecture.lectureType}
          onValueChange={(value) => {
            setLecture((prev) => ({
              ...prev,
              lectureType: value as "video" | "pdf" | "none",
            }));
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="select Content Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="video">video</SelectItem>
            <SelectItem value="pdf">pdf</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <input
        className="p-2 outline-1 rounded-sm"
        type="file"
        name="lectureContent"
        onChange={handleLectureChage}
      />
      {errors.lectureContent && (
        <p className="text-red-400">{errors.lectureContent}</p>
      )}
      <div className="p-4">
        {videoURL && (
          <video
            key={videoURL}
            width="500"
            controls
            className="mt-4 rounded-lg shadow"
          >
            <source src={videoURL} />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      <Button
        onClick={saveLecture}
        className={`bg-black hover:bg-black ${spin && "disabled"}`}
      >
        {spin && <Spinner />}Submit
      </Button>
    </div>
  );
}
