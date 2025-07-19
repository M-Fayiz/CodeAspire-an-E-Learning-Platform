import type { UserRole } from "./auth.types";

export interface IUserType{
    id:string,
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
    imageURL?:string,
    isApproved?:boolean
    socialLinks?:{
        linkedIn:string,
        github:string,
        portfolio:string
    },
    resume?:string

}




