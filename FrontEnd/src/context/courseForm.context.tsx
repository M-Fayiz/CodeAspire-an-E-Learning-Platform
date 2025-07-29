import { createContext, useContext, useState, type ReactNode } from "react";
import type { ICourseData } from "@/types/courses.types";

const CourseFormContext = createContext<any>(null);

interface courseContextProps{
    children:ReactNode
}

export const CourseFormProvider :React.FC<courseContextProps> =({ children }) => {
  const [formData, setFormData] = useState<ICourseData>({ ...initialData });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  return (
    <CourseFormContext.Provider value={{ formData, setFormData, errors, setErrors }}>
      {children}
    </CourseFormContext.Provider>
  );
};

export const useCourseForm = () => useContext(CourseFormContext);
