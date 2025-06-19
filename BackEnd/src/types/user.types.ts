import { IMappedUser } from "../Models/userModel"

export interface IUser{
   name:string,
   email:string,
   phone?:string,
   password:string,
   googleId?:string,
   role:'admin'|'mentor'|'learner',
   profile?:string,
   isActive:boolean,
   createdAt:Date
}



export interface IAuth{
  email:string,
  token:string
}




