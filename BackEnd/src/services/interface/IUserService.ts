
import { IUserModel } from "../../Models/userModel"
import { ProfileData } from "../../types/user.types"
export interface IUserService{
    fetchUser(email:string):Promise<ProfileData>
    changePassword(id:string,currentPassword:string,newPassword:string):Promise<Boolean>
    generatePresignedUploadUrl(fileName:string,fileType:string):Promise<{uploadURL:string,fileURL:string}>
    generatePresignedGetUrl(fileName:string):Promise<string>   
    userProfilePitcureUpdate(imageURL:string,userId:string):Promise<string>
}