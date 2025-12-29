import { z } from "zod";

const baseFields = {
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
      "Password must include uppercase, lowercase, number, and special character",
    ),
 role: z.enum(["admin", "mentor", "learner  "]),
   name: z
  .string()
  .trim()
  .min(4, "Name must be at least 4 characters")
  .max(150, "Name must be less than 150 characters")
  .regex(
    /^[A-Za-z]+(?:[ .'-][A-Za-z]+)*$/,
    "Name can contain only letters, spaces, dots, hyphens, and apostrophes",
  ),


  phone: z.string().min(10, "Phone number must be 10 digits"),
};

export const loginSchema = z.object({
  email: baseFields.email,
  password: baseFields.password,
});

export const registrationSchema = z
  .object({
    ...loginSchema.shape,
    name: baseFields.name,
    phone: baseFields.phone,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const passwordRequirements = [
  { id: "length", text: "At least 8 characters", regex: /.{8,}/ },
  { id: "uppercase", text: "One uppercase letter", regex: /[A-Z]/ },
  { id: "lowercase", text: "One lowercase letter", regex: /[a-z]/ },
  { id: "number", text: "One number", regex: /\d/ },
  {
    id: "special",
    text: "One special character",
    regex: /[!@#$%^&*(),.?":{}|<>]/,
  },
];

export function checkPasswordStrength(password: string) {
  return passwordRequirements.map((req) => ({
    ...req,
    passed: req.regex.test(password),
  }));
}

export const validatePassword = (password: string, confirmPassword: string) => {
  const newErrors: { [key: string]: string } = {};

  if (!password) {
    newErrors.password = "Password is required";
  } else if (password.length < 8) {
    newErrors.password = "Password must be at least 8 characters";
  }

  if (!confirmPassword) {
    newErrors.confirmPassword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
  }

  checkPasswordStrength(password).filter((req) => {
    if (req.passed == false) newErrors.password = req.text;
  });

  return newErrors;
};

export const validateFiles = (
  selectedFile: string,
  targetFile: string,
): string | null => {
  const imageTypes = ["image/png", "image/jpeg", "image/jpg"];
  const videoTypes = ["video/mp4", "video/webm"];
  const pdfTypes = ["application/pdf"];

  switch (targetFile) {
    case "image":
      if (!imageTypes.includes(selectedFile)) {
        return `Allowed image types are: ${imageTypes.join(", ")}`;
      }
      break;
    case "video":
      if (!videoTypes.includes(selectedFile)) {
        return `Allowed video types are: ${videoTypes.join(", ")}`;
      }
      break;
    case "pdf":
      if (!pdfTypes.includes(selectedFile)) {
        return `Allowed file type is: ${pdfTypes.join(", ")}`;
      }
      break;
    default:
      return "Invalid target file type.";
  }

  return null;
};

const validator = {
  required: (value: string) => value.trim() == "" || "This Filed is required",
  email: (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Invalid email address.",
  url: (value: string) =>
    /^(http|https):\/\/[^ "]+$/.test(value) || "Invalid URL",
  // file:(value:string,target:string)=>validateFiles(value,target)
};

const Rules = {
  email: ["required", "email"],
  url: ["required", "url"],
};
interface valueType {
  [key: string]: string;
}
interface rulesType {
  [key: string]: string[];
}
export const ValidateField = (values: valueType, rules: rulesType = Rules) => {
  const fieldErrors: { [key: string]: string } = {};

  for (const key in rules) {
    const fieldRules = rules[key];
    const fieldValue = values[key];
    for (const rule of fieldRules) {
      const validateFn = validator[rule as keyof typeof validator];
      if (validateFn) {
        const result = validateFn(fieldValue);
        if (result !== true) {
          fieldErrors[key] = result;
          break;
        }
      } else {
        console.warn(`Validator "${rule}" is not defined.`);
      }
    }
  }

  return fieldErrors;
};
