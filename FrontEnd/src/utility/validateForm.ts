import {z} from 'zod'



const baseFields = {
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
    "Password must include uppercase, lowercase, number, and special character"
  ),
    role:z.string(),
  name: z.string().min(4, "Name must be at least 4 characters"),
  phone: z.string().min(10, "Phone number must be 10 digits")
};

export const loginSchema=z.object({
    email:baseFields.email,
    password:baseFields.password
})



export const registrationSchema=z.object({
    ...loginSchema.shape,
    name:baseFields.name,
    phone:baseFields.phone,
    confirmPassword:z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


export const passwordRequirements = [
  { id: 'length', text: 'At least 8 characters', regex: /.{8,}/ },
  { id: 'uppercase', text: 'One uppercase letter', regex: /[A-Z]/ },
  { id: 'lowercase', text: 'One lowercase letter', regex: /[a-z]/ },
  { id: 'number', text: 'One number', regex: /\d/ },
  { id: 'special', text: 'One special character', regex: /[!@#$%^&*(),.?":{}|<>]/ }
];

export function checkPasswordStrength(password: string) {
  return passwordRequirements.map(req => ({
    ...req,
    passed: req.regex.test(password)
  }));
}

export const validatePassword = (password:string,confirmPassword:string) => {
    const newErrors: {[key: string]: string} = {};

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    checkPasswordStrength(password).filter(req=>{
         if(req.passed==false) newErrors.password=req.text
    })

    return newErrors;
  };