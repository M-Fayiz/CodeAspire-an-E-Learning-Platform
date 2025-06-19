import { IUser,IAuth } from "../../types/user.types"
import type { IMappedUser } from "../../Models/userModel"
import { JwtPayload } from "jsonwebtoken"
import { IPayload } from "../../Models/userModel"


export interface IAuthService {
    signUp(user:IUser):Promise<string>
    verifyEmail(data:IAuth):Promise<{accessToken:string,refreshToken:string}>
    authMe(token:string):Promise<IMappedUser>
    refreshAccessToken(token:string):Promise<{newAccessToken:string,payload:JwtPayload}>
    login(email:string,password:string):Promise<{accessToken:string,refreshToken:string,payload:IPayload}>
}