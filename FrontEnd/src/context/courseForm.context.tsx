import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { CourseForm, ISession } from "@/types/DTOS/courses.dto.types";

interface FomrContextProps {
  formData: CourseForm;
  addSession: (sessionData: ISession[]) => void;
  setField: (name: keyof CourseForm, value: any) => void;
  courseId: string;
  isDraftReady: boolean;
  setFormData: React.Dispatch<React.SetStateAction<CourseForm>>;
  setCourseId: Dispatch<SetStateAction<string>>;
  setIsDraftReady: Dispatch<SetStateAction<boolean>>;
  resetForm: () => void;
  hydrateFromDB: (course: Partial<CourseForm>) => void;
}
const CourseFormCourseContext = createContext<FomrContextProps | undefined>(
  undefined,
);

const CourseFormProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<CourseForm>({
    _id: "",
    title: "",
    categoryId: "",
    language: "",
    level: "Beginner",
    price: 0,
    mentorId: "",
    subCategoryId: "",
    description: "",
    sessions: [],
    thumbnail: "",
  });
  useEffect(() => {
    console.log("🔥 CourseFormProvider MOUNTED");
  }, []);

  const [courseId, setCourseId] = useState("");
  const [isDraftReady, setIsDraftReady] = useState(false);

  const setField = (name: keyof CourseForm, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const addSession = (sessionData: ISession[]) => {
    setFormData((prv) => ({
      ...prv,
      sessions: sessionData,
    }));
  };
  const resetForm = () => {
    setFormData({
      _id: "",
      title: "",
      categoryId: "",
      language: "",
      level: "Beginner",
      price: 0,
      mentorId: "",
      subCategoryId: "",
      description: "",
      sessions: [],
      thumbnail: "",
    });
  };
  const hydrateFromDB = (course: Partial<CourseForm>) => {
    setFormData((prev) => ({
      ...prev,
      _id: course._id ?? prev._id,
      title: course.title ?? prev.title,
      description: course.description ?? prev.description,
      price: course.price ?? prev.price,
      language: course.language ?? prev.language,
      level: course.level ?? prev.level,
      categoryId: course.categoryId ?? prev.categoryId,
      subCategoryId: course.subCategoryId ?? prev.subCategoryId,
      mentorId: course.mentorId ?? prev.mentorId,
      thumbnail: course.thumbnail ?? prev.thumbnail,
      sessions: course.sessions ?? prev.sessions,
    }));
    console.log("<   -------------   >", course);
    console.log("form inside context :", formData);
  };

  return (
    <CourseFormCourseContext.Provider
      value={{
        formData,
        addSession,
        setField,
        courseId,
        setFormData,
        setCourseId,
        resetForm,
        hydrateFromDB,
        setIsDraftReady,
        isDraftReady,
      }}
    >
      {children}
    </CourseFormCourseContext.Provider>
  );
};

export default CourseFormProvider;

export const useCourseFormContext = () => {
  const context = useContext(CourseFormCourseContext);
  if (!context) {
    throw new Error(
      "useCourseFormContext must be used inside a CourseFormProvider",
    );
  }
  return context;
};
