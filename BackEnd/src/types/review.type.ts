import { Types } from "mongoose";


export interface IReview {
    courseId:Types.ObjectId
    learnerId:Types.ObjectId
    rating:number
    comment?:number
    createdAt?:Date

}