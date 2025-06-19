import type { User } from "../../Models/userModel"
import { IuserModel } from "../../Models/userModel"
export interface IUserRepo{
    createUser(user:any):Promise<IuserModel>
    findUserByEmail(email:string):Promise<IuserModel|null>
}