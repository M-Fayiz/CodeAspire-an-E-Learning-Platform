
import { ProfileData } from "../../types/user.types"
import { IMentor,ILearner,IAdmin } from "../../types/user.types"

import { IMentorDTO } from "../../types/dto.types"
export interface IUserService{
    fetchUser(email:string):Promise<ProfileData>
    changePassword(id:string,currentPassword:string,newPassword:string):Promise<boolean>
    generatePresignedUploadUrl(fileName:string,fileType:string):Promise<{uploadURL:string,fileURL:string}>
    generatePresignedGetUrl(fileName:string):Promise<string>   
    userProfilePitcureUpdate(imageURL:string,userId:string):Promise<string>
    updateUserProfile(id:string,userData:ILearner|IMentor|IAdmin):Promise<IMentorDTO|null>
}