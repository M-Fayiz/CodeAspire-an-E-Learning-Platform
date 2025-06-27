import { HttpResponse } from "../../const/error-message";
import { HttpStatus } from "../../const/http-status";
import { IUserModel } from "../../Models/userModel";
import { IUserRepo } from "../../repository/interface/IUserRepo";
import { createHttpError } from "../../utility/http-error";
import { IAdminService } from "../interface/IAdminService";
import { ProfileData } from "../../types/user.types";

import { parseObjectId } from "../../mongoose/objectId";
import { Types } from "mongoose";

export class AdminService implements IAdminService{

    constructor(private userRepo:IUserRepo){}

   async fetchAllUsers(): Promise<ProfileData[]|null> {
        const allUsers=await this.userRepo.findAllUsers()
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
        return safeUsers
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
}