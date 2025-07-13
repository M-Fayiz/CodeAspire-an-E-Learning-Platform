import { Profile } from "passport-google-oauth20"
import type { UserModel } from "../../Models/userModel"
import { IUserModel } from "../../Models/userModel"
import { IUserRole, searchProps } from "../../types/user.types"
import { Types } from "mongoose"

export interface IUserRepo{
    createUser(user:any):Promise<IUserModel>
    findUserByEmail(email:string):Promise<IUserModel|null>
    updateUserPassword(email:string,password:string):Promise<IUserModel|null>
    findOrCreateUser(profile:Profile,role?:IUserRole):Promise<IUserModel|null>
    findAllUsers(limit:number,skip:number,searchQuery?:searchProps):Promise<IUserModel[]|null>
    findUserCount(searchQuery?:searchProps):Promise<number|0>
    blockUser(id :Types.ObjectId):Promise<IUserModel|null>
    findUserById(id:Types.ObjectId):Promise<IUserModel|null>
    findByIDAndUpdate(id:Types.ObjectId,update:Partial<IUserModel>):Promise<IUserModel|null>
    userProfilePictureUpdate(id:Types.ObjectId,imageURL:string):Promise<IUserModel|null>
}