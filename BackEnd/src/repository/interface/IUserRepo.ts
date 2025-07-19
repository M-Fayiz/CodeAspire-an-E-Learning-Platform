import { Profile } from "passport-google-oauth20"
import type { UserModel } from "../../Models/userModel"
import { IUserModel ,IMenterModel,ILearnerModel,IAdminModel} from "../../Models/userModel"
import { ILearner, IMentor,IAdmin,IUserRole, searchProps } from "../../types/user.types"
import { Types } from "mongoose"

export interface IUserRepo{
    createUser(user:any):Promise<IUserModel|IMenterModel|ILearnerModel|IAdminModel>
    findUserByEmail(email:string):Promise<IUserModel|IMenterModel|ILearnerModel|IAdminModel|null>
    updateUserPassword(email:string,password:string):Promise<IUserModel|IMenterModel|ILearnerModel|IAdminModel|null>
    findOrCreateUser(profile:Profile,role?:IUserRole):Promise<IUserModel|IMenterModel|ILearnerModel|IAdminModel|null>
    findAllUsers(limit:number,skip:number,searchQuery?:searchProps):Promise<IUserModel[]|IMenterModel[]|ILearnerModel[]|IAdminModel[]|null>
    findUserCount(searchQuery?:searchProps):Promise<number|0>
    blockUser(id :Types.ObjectId):Promise<IUserModel|IMenterModel|ILearnerModel|IAdminModel|null>
    findUserById(id:Types.ObjectId):Promise<IUserModel|IMenterModel|ILearnerModel|IAdminModel|null>
    findByIDAndUpdate(id:Types.ObjectId,update:Partial<IUserModel>):Promise<IUserModel|IMenterModel|ILearnerModel|IAdminModel|null>
    userProfilePictureUpdate(id:Types.ObjectId,imageURL:string):Promise<IUserModel|IMenterModel|ILearnerModel|IAdminModel|null>
    approveMentor(id:Types.ObjectId):Promise<IUserModel|null>
   
}