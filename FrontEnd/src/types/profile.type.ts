import type { UserRole } from "./auth.types";

export interface IUserType{
    _id:string,
    name:string,
    email:string,
    phone:string,
    role:UserRole,
    profilePicture?:string,
    bio?:string;
    isActive:boolean;
    createdAt?:Date |string,
    enrolledCourses?: string[];
    expertise?: string[];
    mentorRating?: number;
    imageURL?:string
}




