import {
  createContext,
  useContext,
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
  setFormData: React.Dispatch<React.SetStateAction<CourseForm>>;
  setCourseId: Dispatch<SetStateAction<string>>;
  resetForm: () => void;
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
    mentorsId: "",
    subCategoryId: "",
    description: "",
    sessions: [],
    thumbnail: "",
  });
  
  const [courseId, setCourseId] = useState("");

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
      mentorsId: "",
      subCategoryId: "",
      description: "",
      sessions: [],
      thumbnail: "",
    });
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
