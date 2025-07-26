

export interface ILogin{
    email:string,
    password:string,

}
export interface ISignUp extends ILogin{
    name?:string,
    phone?:string,
    role?:'learner'|'mentor'|'admin',
    confirmPassword?:string,
}
export type UserRole = 'learner' | 'mentor' | 'admin';

export interface IDecodedUserType{
    id : string,
    name?:string,
    email : string,
    role :UserRole,
    profile?:string,
    ApprovalStatus ?: 'pending'|'approved'|'rejected'|'requested',
    isRequested?:boolean
    
}


export interface AuthComponentProps {
  onSubmit: (data: ISignUp) => void;
  onGoogleAuth: (role: UserRole) => void;

}