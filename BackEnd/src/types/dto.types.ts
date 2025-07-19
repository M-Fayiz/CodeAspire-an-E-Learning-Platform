import { Types } from "mongoose"



interface IBaseRoleDTO{
    id:Types.ObjectId,
    name:string,
    email:string,
    phone?:string,
    role:'mentor'|'learner'|'admin'
    profilePicture?:string,
    isActive:boolean,
    bio?:string,
}

export interface IMentorDTO extends IBaseRoleDTO{
   
    expertise?:string[],
    socialLinks?:object,
    mentorRating?:number,
    resume?:string,
    isApproved:boolean,
    isRequested?:boolean
}

export interface ILearnerDTO extends IBaseRoleDTO {
    enrolledCourses?:Types.ObjectId[]
}

export interface IPayloadDTO{
    id:Types.ObjectId,
    name?:string,
    email:string,
    role:'learner'|'admin'|'mentor'
    isApproved?:boolean
    isRequested?:boolean
}