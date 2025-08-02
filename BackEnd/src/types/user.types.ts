
import { Types } from "mongoose"


export type mentorApprovalStatus='pending'|'approved'|'rejected'|'requested'
export interface IUser{
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phone?: string;
  googleId?: string;
  role: 'admin' | 'mentor' | 'learner';
  profilePicture?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt:DataTransfer;
  bio?: string; 
  ApprovalStatus : mentorApprovalStatus
  isRequested:boolean
}

export interface IMentor extends IUser{
  role:'mentor',
  expertise:string[],
  bio:string,
  rating:number,
  socialLinks: {
    linkedIn?: string;
    github?: string;
    portfolio?: string;
  };
  resume?: string;
  
}

export interface ILearner extends IUser{
  role:'learner',
  enrolledCourses:Types.ObjectId[]
}

export interface IAdmin extends IUser{
  role:'admin'
}


export type IUserRole='admin'|'learner'|'mentor'

export interface IAuth{
  email:string,
  token:string
}

export type IAnyUser=IUser|IAdmin|ILearner|IMentor

export interface searchProps{
  name:string|'',
  role:string|'',
  isActive:boolean|''
} 

export type IRole='admin'|'mentor'|'learner'




