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

  expertise?: string[];
  department?: string;
  mentorRating?: number;
  bio?: string;

  
  enrolledCourses?: Types.ObjectId[];
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




