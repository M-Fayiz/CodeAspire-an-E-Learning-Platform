import { IUserModel } from "../../Models/userModel";
import { ILearnerDTO, IMentorDTO, } from "../../types/dto.types";
import { ProfileData } from "../../types/user.types";
import { UserFetchResponse } from "../implementation/AdminService";


export interface IAdminService{
    
  fetchAllUsers(page:number,isActive:boolean|'',name:string,role:string):Promise<UserFetchResponse>
  blockUser(id:string):Promise<{isActive:boolean,id:string}>
  userProfile(id:string):Promise<ILearnerDTO|IMentorDTO |null>
  approveMentor(id:string): Promise<{isApproved:boolean}>
  
}