import { IUserService } from "../interface/IUserService";
import { IUserRepo } from "../../repository/interface/IUserRepo";
import { IAdminModel, ILearnerModel, IMenterModel, IUserModel } from "../../models/user.model";
import { createHttpError } from "../../utility/http-error";
import { HttpStatus } from "../../const/http-status";
import { HttpResponse } from "../../const/error-message";
import { IAdmin, ILearner } from "../../types/user.types";
import { parseObjectId } from "../../mongoose/objectId";
import { comparePassword,hashPassword } from "../../utility/bcrypt.util";
import { getObjectURL, putObjectURl } from "../../config/s3Bucket.config";
import { IMentorRepository } from "../../repository/interface/IMentorRepository";
import { AdminDTO, LearnerDTO, MentorDTO } from "../../dtos/role.dto";
import { IAdminDTO, ILearnerDTO, IMentorDTO } from "../../types/dto.types";


export class UserService implements IUserService{

    constructor(private _userRep:IUserRepo,private _mentorRepository:IMentorRepository){}

    async fetchUser(email: string): Promise<ILearnerDTO|IMentorDTO|IAdminDTO> {
        
        const userData=await this._userRep.findUserByEmail(email)
        if(!userData){
            throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.USER_NOT_FOUND)
        }
        switch(userData.role){
            case 'learner':
                return LearnerDTO(userData as ILearnerModel)
            case 'mentor':
                return MentorDTO(userData as IMenterModel)
            case 'admin':
                return AdminDTO(userData as IAdminModel)        
        }
     
       
    }

    async changePassword(id:string,currentPassword: string, newPassword: string): Promise<boolean> {
        
        const objectId=parseObjectId(id)
        if(!objectId){
            throw createHttpError(HttpStatus.BAD_REQUEST,HttpResponse.INVALID_CREDNTIALS)
        }
        const user=await this._userRep.findUserById(objectId)
        if(!user){
            throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.USER_NOT_FOUND)
        }

        const passwordIsMatch=await comparePassword(currentPassword,user.password)
        console.log('is password is match',passwordIsMatch)
        if(!passwordIsMatch){
            throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.INVALID_CREDNTIALS)
        }
        const hashedPassword=await hashPassword(newPassword)
        await this._userRep.updateUserPassword(user.email,hashedPassword)
        
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
        const userData=await this._userRep.userProfilePictureUpdate(userObjectId,imageURL)
        if(!userData||!userData.profilePicture){
            throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.USER_NOT_FOUND)
        }
        return  userData.profilePicture 
    }
    async updateUserProfile(id: string, userData: ILearner | IMenterModel | IAdmin):Promise<IMentorDTO|null> {
        const userId=parseObjectId(id) 
        if(!userId) {
            throw createHttpError(HttpStatus.BAD_REQUEST,HttpResponse.INVALID_CREDNTIALS)
        }
        const user=await this._userRep.findUserById(userId)
        if(!user){
            throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.USER_NOT_FOUND)
        }
        
        switch(user.role){
            case 'mentor':
            const updatedMentor=await this._mentorRepository.updateMentorProfile(userId,userData as IMenterModel)
            return updatedMentor?MentorDTO(updatedMentor):null
        }
       
        return null
    }
}