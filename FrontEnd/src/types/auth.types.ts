import type { mentorApprovalStatus } from "./users.type";

export interface ILogin {
  email: string;
  password: string;
}
export interface ISignUp extends ILogin {
  name?: string;
  phone?: string;
  role?: UserRoleType;
  confirmPassword?: string;
}
export const UserRole = {
  LEARNER: "learner",
  MENTOR: "mentor",
  ADMIN: "admin",
};
export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export interface IDecodedUserType {
  id: string;
  name?: string;
  email: string;
  role: UserRoleType;
  profile?: string;
  ApprovalStatus?: mentorApprovalStatus;
  isRequested?: boolean;
}

export interface AuthComponentProps {
  onSubmit: (data: ISignUp) => void;
  onGoogleAuth: (role: UserRoleType) => void;
}

export const AuthStatus = {
  CHECKING: "checking",
  AUTHENTICATED: "authenticated",
  GUEST: "guest",
  BLOCKED: "blocked",
  ACCESS_DENIED:'denied'
} as const;
export type AuthStatusType = (typeof AuthStatus)[keyof typeof AuthStatus];
