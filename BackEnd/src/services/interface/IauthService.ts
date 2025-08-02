import { IUser,IAuth } from "../../types/user.types"
import { JwtPayload } from "jsonwebtoken"
import { IPayload } from "../../models/user.model"
import { IUserDTO } from "../../types/dto.types"


export interface IAuthService {
    signUp(user:IUser):Promise<string>
    verifyEmail(data:IAuth):Promise<{accessToken:string,refreshToken:string}>
    authMe(token:string):Promise<IUserDTO>
    refreshAccessToken(token:string):Promise<{newAccessToken:string,payload:JwtPayload}>
    login(email:string,password:string):Promise<{accessToken:string,refreshToken:string,MappedUser:IUserDTO}>
    forgotPassword(email:string):Promise<string>
    resetPassword(email:string,token:string,password:string):Promise<string>
    generateToken(user:IUser):Promise<{accessToken:string,refreshToken:string,payload:JwtPayload }>

}