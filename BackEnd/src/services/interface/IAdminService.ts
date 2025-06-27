import { IUserModel } from "../../Models/userModel";
import { ProfileData } from "../../types/user.types";


export interface IAdminService{
    
  fetchAllUsers():Promise<ProfileData[]|null>
  blockUser(id:string):Promise<{isActive:boolean,id:string}>
  
}