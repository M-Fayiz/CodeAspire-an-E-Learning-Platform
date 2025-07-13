import { IUserService } from "../interface/IUserService";
import { IUserRepo } from "../../repository/interface/IUserRepo";
import { IUserModel } from "../../Models/userModel";
import { createHttpError } from "../../utility/http-error";
import { HttpStatus } from "../../const/http-status";
import { HttpResponse } from "../../const/error-message";
import { ProfileData } from "../../types/user.types";
import { parseObjectId } from "../../mongoose/objectId";
import { comparePassword,hashPassword } from "../../utility/bcrypt.util";
import { getObjectURL, putObjectURl } from "../../config/s3Bucket.config";


export class UserService implements IUserService{

    constructor(private userRep:IUserRepo){}

    async fetchUser(email: string): Promise<ProfileData> {
        
        const userData=await this.userRep.findUserByEmail(email)
        if(!userData){
            throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.USER_NOT_FOUND)
        }

        const profileData={
            _id: userData._id,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            role: userData.role,
            profilePicture: userData.profilePicture,
            isActive:userData.isActive,
            bio: userData.bio,
            mentorRating: userData.mentorRating,
            expertise: userData.expertise,
            enrolledCourses:userData.enrolledCourses
        }
        return profileData
    }

    async changePassword(id:string,currentPassword: string, newPassword: string): Promise<Boolean> {
        
        const objectId=parseObjectId(id)
        if(!objectId){
            throw createHttpError(HttpStatus.BAD_REQUEST,HttpResponse.INVALID_CREDNTIALS)
        }
        const user=await this.userRep.findUserById(objectId)
        if(!user){
            throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.USER_NOT_FOUND)
        }

        const passwordIsMatch=await comparePassword(currentPassword,user.password)
        console.log('is password is match',passwordIsMatch)
        if(!passwordIsMatch){
            throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.INVALID_CREDNTIALS)
        }
        const hashedPassword=await hashPassword(newPassword)
        await this.userRep.updateUserPassword(user.email,hashedPassword)
        
        return true
    }
    async generatePresignedUploadUrl(fileName: string, fileType: string): Promise<{ uploadURL: string; fileURL: string; }> {
        
        const {uploadURL,fileURL}=await putObjectURl(fileName,fileType)
        if(!uploadURL||!fileURL){
            throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR,HttpResponse.SERVER_ERROR)
        }
        return {uploadURL,fileURL}
    }

    async generatePresignedGetUrl(fileName: string): Promise< string> {

        const getURL=await getObjectURL(fileName)
        if(!getURL){
            throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR,HttpResponse.SERVER_ERROR)
        }
        return getURL
    }
    async userProfilePitcureUpdate(imageURL: string, userId: string): Promise<string> {
        const userObjectId=parseObjectId(userId)
        if(!userObjectId){
            throw createHttpError(HttpStatus.BAD_REQUEST,HttpResponse.INVALID_CREDNTIALS)
        }
        const userData=await this.userRep.userProfilePictureUpdate(userObjectId,imageURL)
        if(!userData||!userData.profilePicture){
            throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.USER_NOT_FOUND)
        }
        return  userData.profilePicture 
    }
}