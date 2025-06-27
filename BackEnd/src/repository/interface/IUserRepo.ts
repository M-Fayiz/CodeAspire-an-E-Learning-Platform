import { Profile } from "passport-google-oauth20"
import type { User } from "../../Models/userModel"
import { IUserModel } from "../../Models/userModel"
import { IUserRole } from "../../types/user.types"
import { Types } from "mongoose"

export interface IUserRepo{
    createUser(user:any):Promise<IUserModel>
    findUserByEmail(email:string):Promise<IUserModel|null>
    updateUserPassword(email:string,password:string):Promise<IUserModel|null>
    findOrCreateUser(profile:Profile,role?:IUserRole):Promise<IUserModel|null>
    findAllUsers():Promise<IUserModel[]|null>
    blockUser(id :Types.ObjectId):Promise<IUserModel|null>
    findUserById(id:Types.ObjectId):Promise<IUserModel|null>
}