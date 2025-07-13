import { IMappedUser } from "../Models/userModel"
import { Types } from "mongoose"

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
  expertise?: string[];
  department?: string;
  mentorRating?: number;
  bio?: string; 
  enrolledCourses?: Types.ObjectId[];
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
  resumeUrl?: string;
  isApproved: boolean;
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



export interface ProfileData{
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string | undefined;
  role: "admin" | "mentor" | "learner";
  profilePicture: string | undefined;
  bio: string | undefined;
  isActive:boolean
  mentorRating: number | undefined;
  expertise: string[] | undefined;
  enrolledCourses:Types.ObjectId[]| undefined
}

export interface searchProps{
  name:string|'',
  role:string|'',
  isActive:boolean|''
} 




