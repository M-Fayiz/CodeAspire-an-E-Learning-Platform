import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import {
  BetweenHorizontalStart,
  Trash2,
  Edit,
  Menu,
  ClipboardPen,
  ClipboardPaste,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/Inputs";

import { toast } from "sonner";
import type { ILecture, ISession } from "@/types/DTOS/courses.types";
import { useCourseFormContext } from "@/context/courseForm.context";
import { sessionSchema } from "@/schema/courseForm.schema";
import courseService from "@/service/client-API/mentor/course.service";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Notebook } from "lucide-react";
import { AddLecture } from "./CourseSheetFields.tsx/AddLecture";
import { EditLecture } from "./CourseSheetFields.tsx/EditLecture";

interface CurriculumProps {
  courseId?: string;
}

const CourseCurriculum: React.FC<CurriculumProps> = () => {
  const [sessions, setSessions] = useState<ISession>({
    title: "",
    lectures: [],
  });
  const { formData, addSession, courseId } = useCourseFormContext();
  const [sessionSpin, setSessionSpin] = useState(false);
  const [errors, setErros] = useState<{ [key: string]: string }>({});
  const [selectedSession, setSelectedSession] = useState("");
  const [passLecture, setPassLecture] = useState<ILecture | null>(null);
  const [sheet, setSheet] = useState<
    "addLecture" | "editLecture" | "editSession" | null
  >(null);
  // this is Controll Session Inputs
  const handleChanges = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setSessions((prv) => ({
      ...prv,
      [name]: value,
    }));
  };

  const saveSessions = async (e: React.FormEvent) => {
    e.preventDefault();

    let fieldErrors: Record<string, string> = {};
    const result = sessionSchema.safeParse(sessions);
    setSessionSpin(true);
    if (!result.success) {
      result.error.issues.forEach((err) => {
        const fieldName = err.path.join(".");
        fieldErrors[fieldName] = err.message;
      });
      setErros(fieldErrors);
      return;
    }
    try {
      const addedSessions = await courseService.addSessions(courseId, sessions);
      if (addedSessions) {
        addSession(addedSessions.sessions as ISession[]);
        setSessionSpin(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        setSessionSpin(false);
        toast.error(error.message);
      }
    }

    setSessions({ title: "", lectures: [] });
    setErros({});
  };

  const handleSelectSession = (sessionId: string) => {
    setSelectedSession(sessionId);
    setSheet("addLecture");
  };

  const handleEditLecture = (sessionId: string, lecture: ILecture) => {
    setSelectedSession(sessionId);
    setPassLecture(lecture);
    setSheet("editLecture");
  };
  return (
    <div>
      <h3 className="text-lg font-semibold ml-5 m-4 mb-2">Curriculum</h3>
      <div className="m-4 p-3 flex flex-col gap-3">
        {formData.sessions && formData.sessions.length > 0 ? (
          formData.sessions.map((session, index) => (
            <div
              key={index}
              className="bg-sky-100 rounded-sm p-4 space-y-2 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Menu size={18} />
                  <h4 className="font-semibold text-gray-800">
                    {session.title}
                  </h4>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectSession(session._id || "")}
                  >
                    <BetweenHorizontalStart className="mr-1" size={14} />
                    Add Lectures
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    // onClick={() => removeSession(index)}
                  >
                    <Trash2 size={14} className="mr-1" />
                    Remove
                  </Button>
                  <Button type="button" variant="secondary" size="sm">
                    <Edit size={14} className="text-gray-600" />
                    Edit
                  </Button>
                </div>
              </div>

              {session.lectures.length > 0 && (
                <div className="ml-7 mt-2 space-y-1">
                  {session.lectures.map((lecture) => (
                    <div
                      key={lecture._id}
                      className="text-sm bg-sky-50 p-2 rounded-sm text-gray-700 pl-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="flex gap-1 justify-center pl-2 align-middle font-semibold text-gray-800">
                            <Notebook size={16} className="text-gray-500" />{" "}
                            {lecture.title}
                          </h4>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            className=""
                            size="sm"

                            // onClick={() => removeSession(index)}
                          >
                            <Trash2 size={10} className="mr-1" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleEditLecture(session._id as string, lecture)
                            }
                          >
                            <Edit size={14} className="text-gray-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">No sessions added yet.</p>
        )}
      </div>

      <div>
        <Accordion
          type="single"
          collapsible
          className="bg-amber-100 m-5  rounded-sm pl-6 pr-6"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="no-underline">
              Add Session
            </AccordionTrigger>
            <AccordionContent className="flex flex-row gap-2 justify-between">
              <Input
                type="text"
                placeholder="Insert Session"
                name="title"
                value={sessions.title}
                onChange={handleChanges}
                error={errors.title}
              />
              <Button
                type="button"
                className={`bg-white ${sessionSpin && "disabled"}`}
                variant="outline"
                onClick={saveSessions}
              >
                Save Session
                {sessionSpin && <Spinner />}
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      {/* //lecture add */}
      <div>
        <Sheet open={!!sheet} onOpenChange={(open) => !open && setSheet(null)}>
          <SheetContent>
            <SheetHeader>
              {sheet == "addLecture" ? (
                <SheetTitle className="flex gap-2 text-gray-700 text-lg">
                  <ClipboardPaste size={25} />
                  Adding Lecture
                </SheetTitle>
              ) : sheet == "editLecture" ? (
                <SheetTitle className="flex gap-2 text-gray-700 text-lg">
                  {" "}
                  <ClipboardPen size={25} /> Edit Lecture
                </SheetTitle>
              ) : (
                sheet == "editSession" && <SheetTitle> Edit Session</SheetTitle>
              )}
            </SheetHeader>
            {/* <ProgressBar mode="determinate" style={{ height: '6px' }}></ProgressBar> */}
            <SheetDescription>
              {sheet == "addLecture" && (
                <AddLecture
                  courseId={courseId}
                  sessionId={selectedSession}
                  closeSheet={() => setSheet(null)}
                />
              )}
              {sheet == "editLecture" && (
                <EditLecture
                  courseId={courseId}
                  editLecture={passLecture as ILecture}
                  lectureId={passLecture?._id as string}
                  sessionId={selectedSession}
                  closeSheet={() => setSheet(null)}
                />
              )}
            </SheetDescription>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default CourseCurriculum;
