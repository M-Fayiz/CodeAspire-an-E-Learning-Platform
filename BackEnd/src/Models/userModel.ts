import mongoose,{Schema,Document,Types} from "mongoose";
import  { IUser } from "../types/user.types";

export interface IUserModel extends Document <Types.ObjectId>,Omit<IUser,'_id'>{}



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
            profilePicture:{
                type:String
            },
            password:{
                type:String
            },
            // Mentor Specified 
            expertise: [{ type: String }],
           
            mentorRating: { type: Number },
            bio: { type: String },

            // Learner
            enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],


},{timestamps:true})

export  const User=mongoose.model<IUserModel>('User',UserModel)


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