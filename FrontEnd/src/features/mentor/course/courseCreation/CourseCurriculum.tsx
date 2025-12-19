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
import { Input } from "@/components/ui/Inputs";

import { toast } from "sonner";
import type { ILecture, ISession } from "@/types/DTOS/courses.dto.types";
import { useCourseFormContext } from "@/context/courseForm.context";
import { sessionSchema } from "@/schema/courseForm.schema";
import courseService from "@/service/mentor/course.service";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { Notebook } from "lucide-react";
import { AddLecture } from "../CourseSheetFields.tsx/AddLecture";
import { EditLecture } from "../CourseSheetFields.tsx/EditLecture";

interface CurriculumProps {
  courseId?: string;
}

const CourseCurriculum: React.FC<CurriculumProps> = () => {
  const [sessions, setSessions] = useState<ISession>({
    title: "",
    lectures: [],
  });
  const { formData, addSession, courseId, setFormData } =
    useCourseFormContext();
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
  //Save Session
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
        console.log("added Session :", addedSessions);
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

  const handleDeleteSession = async (sessionId: string) => {
    const deleteSession = await courseService.removeSession(
      formData._id as string,
      sessionId,
    );
    if (deleteSession) {
      setFormData((prv) => ({ ...prv, sessions: deleteSession.sessions }));
    }
  };
  const handleRemoveLecture = async (
    sessionId: string,
    lectureId: string,
  ) => {
    const updatedLecture=await courseService.removeLecture(formData._id as string,sessionId,lectureId)
    console.log(updatedLecture)
  };
  return (
    <div className="bg-white min-h-screen">
      <h3 className="text-xl font-semibold text-gray-900 px-6 py-4 border-b">
        Curriculum
      </h3>

      <div className="px-6 py-4 flex flex-col gap-4">
        {formData.sessions && formData.sessions.length > 0 ? (
          formData.sessions.map((session, index) => (
            <div
              key={index}
              className="bg-gray-200 border border-gray-200 rounded-lg p-5 space-y-4 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Menu size={17} className="text-gray-500" />
                  <h4 className="text-base font-medium text-gray-900">
                    {session.title}
                  </h4>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                    onClick={() => handleSelectSession(session._id || "")}
                  >
                    <BetweenHorizontalStart size={13} className="mr-1" />
                    Lectures
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="border border-gray-300 bg-white text-gray-700 hover:text-red-600 hover:bg-gray-100"
                      >
                        <Trash2 size={13} className="mr-1" />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your session data and lectures from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() =>
                            handleDeleteSession(session._id as string)
                          }
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button
                    type="button"
                    size="sm"
                    className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  >
                    <Edit size={13} />
                  </Button>
                </div>
              </div>

              {session.lectures.length > 0 && (
                <div className="ml-5 space-y-2 border-l pl-4">
                  {session.lectures.map((lecture) => (
                    <div
                      key={lecture._id}
                      className="bg-gray-50 border border-gray-200 rounded p-3 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2">
                        <Notebook size={15} className="text-gray-500" />
                        <span className="text-sm text-gray-800 font-medium">
                          {lecture.title}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="   text-gray-700 hover:text-red-600 "
                            >
                              <Trash2 size={13} />
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your session data and
                                lectures from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() =>
                                  handleRemoveLecture(
                                    session._id as string,
                                    lecture._id as string,
                                  )
                                }
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <Button
                          size="sm"
                          className="text-gray-500 hover:text-black"
                          variant="ghost"
                          onClick={() =>
                            handleEditLecture(session._id as string, lecture)
                          }
                        >
                          <Edit size={13} />
                        </Button>
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

      {/* Add Session */}
      <div className="px-6 pb-6">
        <Accordion
          type="single"
          collapsible
          className="bg-white border border-gray-300 rounded-lg"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="px-4 py-3 text-sm font-medium text-gray-800 hover:no-underline">
              Add Session
            </AccordionTrigger>

            <AccordionContent className="flex gap-3 px-4 pb-4">
              <Input
                type="text"
                placeholder="Session title"
                name="title"
                value={sessions.title}
                onChange={handleChanges}
                error={errors.title}
              />

              <Button
                type="button"
                className="bg-black text-white hover:bg-gray-900 flex gap-2 items-center"
                onClick={saveSessions}
              >
                Save
                {sessionSpin && <Spinner />}
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <Sheet open={!!sheet} onOpenChange={(open) => !open && setSheet(null)}>
        <SheetContent className="bg-white border-l shadow-xl">
          <SheetHeader>
            {sheet === "addLecture" && (
              <SheetTitle className="flex gap-2 text-black font-medium">
                <ClipboardPaste size={22} />
                Add Lecture
              </SheetTitle>
            )}
            {sheet === "editLecture" && (
              <SheetTitle className="flex gap-2 text-black font-medium">
                <ClipboardPen size={22} />
                Edit Lecture
              </SheetTitle>
            )}
          </SheetHeader>

          <SheetDescription className="mt-4">
            {sheet === "addLecture" && (
              <AddLecture
                courseId={courseId}
                sessionId={selectedSession}
                closeSheet={() => setSheet(null)}
              />
            )}

            {sheet === "editLecture" && (
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
  );
};

export default CourseCurriculum;
