import mongoose,{Schema,Document,Types} from "mongoose";
import  { IUser,IAdmin,ILearner,IMentor } from "../types/user.types";

const option={discriminatorKey:'role',timeStamps:true}

export interface IUserModel extends Document <Types.ObjectId>,Omit<IUser,'_id'>{}
export interface IMenterModel extends Document <Types.ObjectId>,Omit<IMentor,'_id'>{}
export interface IAdminModel extends Document <Types.ObjectId>,Omit<IAdmin,'_id'>{}
export interface ILearnerModel extends Document <Types.ObjectId>,Omit<ILearner,'_id'>{}


const BaseUserSchema=new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: Number,
  password: String,
  profilePicture: String,
  googleId:{type:String},
  isActive: { type: Boolean, default: false },
    
},option)
export const UserModel=mongoose.model<IUserModel>('User',BaseUserSchema)


const MentorSchema=new mongoose.Schema({
  expertise: [String],
  bio: String,
  yearsOfExperience: Number,
  mentorRating: Number,
  socialLinks: {
    linkedIn: String,
    github: String,
    portfolio: String
  },
  resumeUrl: String,
  isApproved: { type: Boolean, default: false }
})
export const MentorModel=UserModel.discriminator('mentor',MentorSchema)



const LearnerSchema = new mongoose.Schema({
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});
export const LearnerModel=UserModel.discriminator('learner',LearnerSchema)



const AdminSchema = new mongoose.Schema({
  permissions: [String] 
});
export const AdminModel = UserModel.discriminator('admin', AdminSchema);




// const UserModel=new mongoose.Schema({
//             name:{
//                 type:String,
//                 required:true
//             },
//             email:{
//               type:String,
//               required:true
//             },
//             phone:{
//                 type:Number,
                
//             },
//             googleId:{
//                 type:String
//             },
//             isActive:{
//                 type:Boolean,
//                 default:false
//             },
//             role:{
//                 type:String,
//                 enum:['admin','learner','mentor'],
                
//             },
//             profilePicture:{
//                 type:String
//             },
//             password:{
//                 type:String
//             },
//             // Mentor Specified 
//             expertise: [{ type: String }],
           
//             mentorRating: { type: Number },
//             bio: { type: String },

//             // Learner
//             enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],


// },{timestamps:true})

// export  const User=mongoose.model<IUserModel>('User',UserModel)


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