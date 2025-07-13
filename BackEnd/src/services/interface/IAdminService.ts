import { IUserModel } from "../../Models/userModel";
import { ProfileData } from "../../types/user.types";
import { UserFetchResponse } from "../implementation/AdminService";


export interface IAdminService{
    
  fetchAllUsers(page:number,isActive:boolean|'',name:string,role:string):Promise<UserFetchResponse>
  blockUser(id:string):Promise<{isActive:boolean,id:string}>
  userProfile(id:string):Promise<ProfileData|null>
  
}