import type { mentorApprovalStatus } from "./users.type";

export interface ILogin {
  email: string;
  password: string;
}
export interface ISignUp extends ILogin {
  name?: string;
  phone?: string;
  role?: UserRole
  confirmPassword?: string;
}
export type UserRole = "learner" | "mentor" | "admin";

export interface IDecodedUserType {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
  profile?: string;
  ApprovalStatus?:mentorApprovalStatus
  isRequested?: boolean;
}

export interface AuthComponentProps {
  onSubmit: (data: ISignUp) => void;
  onGoogleAuth: (role: UserRole) => void;
}

export  const AuthStatus ={
  CHECKING: "checking",
  AUTHENTICATED: "authenticated",
  GUEST: "guest",
  BLOCKED: "blocked"
} as const
export type AuthStatusType =
  (typeof AuthStatus)[keyof typeof AuthStatus];
