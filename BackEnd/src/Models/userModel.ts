import mongoose,{Schema,Document,Types} from "mongoose";
import  { IUser } from "../types/user.types";

export interface IuserModel extends Document <Types.ObjectId>,Omit<IUser,'_id'>{}



const UserModel=new mongoose.Schema({
            name:{
                type:String,
                required:true
            },
            email:{
              type:String,
              required:true
            },
            phone:{
                type:Number,
                
            },
            googleId:{
                type:String
            },
            isActive:{
                type:Boolean,
                default:false
            },
            role:{
                type:String,
                enum:['admin','learner','mentor'],
                
            },
            profile:{
                type:String
            },
            password:{
                type:String
            }

})

export  const User=mongoose.model<IuserModel>('User',UserModel)


export interface IMappedUser{
    id:Types.ObjectId,
    name:string
    email:string,
    role:string,
    profile?:string
}
export interface IPayload{
    id:Types.ObjectId,
    email:string,
    role:'learner'|'admin'|'mentor'
}