import { HttpResponse } from "../../const/error-message";
import { HttpStatus } from "../../const/http-status";
import { IUserModel } from "../../Models/userModel";
import { IUserRepo } from "../../repository/interface/IUserRepo";
import { createHttpError } from "../../utility/http-error";
import { IAdminService } from "../interface/IAdminService";
import { ProfileData } from "../../types/user.types";
import { parseObjectId } from "../../mongoose/objectId";

export type UserFetchResponse = {
  safeUsers: ProfileData[];
  totalPage: number;
};


export class AdminService implements IAdminService{

    constructor(private userRepo:IUserRepo){}

   async fetchAllUsers(page:number,isActive:boolean|'',name:string,role:string): Promise<UserFetchResponse> {
    let limit=3
    let skip=(page-1)*limit
       
       const searchQuery={
        name:name,
        role:role,
        isActive:isActive
       }
    
        const [allUsers,userCount]=await Promise.all([this.userRepo.findAllUsers(limit,skip,searchQuery),this.userRepo.findUserCount(searchQuery)])
        if(!allUsers){
            throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR,HttpResponse.SERVER_ERROR)
        }
        const safeUsers = allUsers.map(user => ({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone:user.phone,
            isActive: user.isActive,
            profilePicture: user.profilePicture,
            expertise: user.expertise,
            mentorRating: user.mentorRating,
            bio:user.bio,
            enrolledCourses: user.enrolledCourses,
 
        }));
        const totalPage=Math.ceil(userCount/limit)
        return {safeUsers,totalPage}
    }

    async blockUser(id: string): Promise<{isActive:boolean,id:string}> {
       
        const objectId=parseObjectId(id)
         if(!objectId){
            throw createHttpError(HttpStatus.BAD_REQUEST,HttpResponse.INVALID_CREDNTIALS)
        }

        const updatedUser=await this.userRepo.blockUser(objectId )
     
        if(!updatedUser){
            throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR,HttpResponse.SERVER_ERROR)
        }
        const result={
            isActive:updatedUser.isActive,
            id:updatedUser.id
        }
        return result
    }
    async userProfile(id: string): Promise<ProfileData | null> {
        const objectId=parseObjectId(id)
        if(!objectId){
            throw createHttpError(HttpStatus.BAD_REQUEST,HttpResponse.INVALID_CREDNTIALS)
        }
        
        const profileData=await this.userRepo.findUserById(objectId)
        if(!profileData){
            throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.USER_NOT_FOUND)
        }

        const safeUsers = {
            _id: profileData._id,
            name: profileData.name,
            email: profileData.email,
            role: profileData.role,
            phone:profileData.phone,
            isActive: profileData.isActive,
            profilePicture: profileData.profilePicture,
            expertise: profileData.expertise,
            mentorRating: profileData.mentorRating,
            bio:profileData.bio,
            enrolledCourses: profileData.enrolledCourses,
        }

        return safeUsers
    }
}
