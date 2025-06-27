import { IUser,IAuth } from "../../types/user.types";
import { IAuthService } from "../interface/IauthService";
import { IUserRepo } from "../../repository/interface/IUserRepo";
import { hashPassword,comparePassword } from "../../utility/bcrypt.util";
// import { generateOtp } from "../../utility/generate.otp";
import { sendToken } from "../../utility/send-mail.util";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../../config/redis";
import { HttpStatus } from "../../const/http-status";
import { HttpResponse } from "../../const/error-message";
import { createHttpError } from "../../utility/http-error";
import { generateTokens } from "../../utility/jwt-token.util";
import { verifyAccesToken,verifyRefreshToken } from "../../utility/jwt-token.util";
import type { IMappedUser } from "../../Models/userModel";
import { JwtPayload } from "jsonwebtoken";
import { IPayload } from "../../Models/userModel";
import { generateSecureToken } from "../../utility/crypto.util";
import { redisPrefix } from "../../const/redisKey";




export class AuthService implements IAuthService{

    constructor(private userRepo:IUserRepo){}

    async signUp(user: IUser): Promise<string> {
     
        const isUserExist=await this.userRepo.findUserByEmail(user.email)
        if(isUserExist){
            throw createHttpError(HttpStatus.CONFLICT,HttpResponse.USER_EXIST)
        } 
        user.password=await hashPassword(user.password as string)

         const token=uuidv4()
         
         await sendToken(user.email,token,'verify-email')
         let key=`${redisPrefix.VERIFY_EMAIL}:${token}`
                
        
        const response= await redisClient.setEx(key,300,JSON.stringify(user))
      
        if(!response){
            throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR,HttpResponse.SERVER_ERROR)
        }

        return user.email
    }
    async verifyEmail(data:IAuth):Promise<{accessToken:string,refreshToken:string}>{
        try {
               let key=`${redisPrefix.VERIFY_EMAIL}:${data.token}`
               
      
            let result=await redisClient.get(key)
            console.log('verify email',result)
            if(!result){
                throw createHttpError(HttpStatus.UNAUTHORIZED,HttpResponse.USER_CREATION_FAILED)
             
            }
            
            const storedData=JSON.parse(result)
          
           
     
            let user={
                name:storedData.name,
                email:storedData.email,
                phone:storedData.phone,
                password:storedData.password,
                role:storedData.role,
                isActive:true
             
            }
        
           const newUser=await this.userRepo.createUser(user as IUser)
           await redisClient.del(key)
           console.log('📈 newwUser',newUser)
           if(!newUser){
            throw createHttpError(HttpStatus.CONFLICT,HttpResponse.USER_CREATION_FAILED)
           }
            const payload={
                id:newUser._id,
                name:newUser.name,
                email:newUser.email,
                role:newUser.role
            }
           return generateTokens(payload)
        } catch (error) {
            throw error
            
        }
    }

    async authMe(token: string):Promise<IMappedUser> {
           
        const decode= verifyAccesToken(token) 
       
        if(!decode){
            throw createHttpError(HttpStatus.UNAUTHORIZED,HttpResponse.ACCESS_TOKEN_EXPIRED)
        }

        const user=await this.userRepo.findUserByEmail(decode.email)
        if(user){
            console.log('user from authme service')
        }

        if(!user){
            throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.USER_NOT_FOUND)
        }
        if(!user.isActive){
            throw createHttpError(HttpStatus.FORBIDDEN,HttpResponse.USER_BLOCKED)
        }
        return {
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            profile:user.profilePicture
        }
    }

    async refreshAccessToken(token: string): Promise<{ newAccessToken: string; payload: JwtPayload; }> {
        if(!token){
            throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.USER_NOT_FOUND)
        }
        const decode =verifyRefreshToken(token) as JwtPayload

        if(!decode){
            throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.REFRESH_TOKEN_EXPIRED)
        }

        const user= await this.userRepo.findUserByEmail(
            decode.email
        )
        if(!user?.isActive){
            throw createHttpError(HttpStatus.FORBIDDEN,HttpResponse.USER_BLOCKED)
        }

        const payload={
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
        }
        
        const {accessToken}=generateTokens(payload)
        const newAccessToken=accessToken
        return {newAccessToken,payload}

    }

    async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string; payload:IPayload }> {
        
        const user=await this.userRepo.findUserByEmail(email)
        if(!user){
            throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.USER_NOT_FOUND)
        }
        if(!user.isActive){
            throw createHttpError(HttpStatus.FORBIDDEN,HttpResponse.USER_BLOCKED)
        }
         
        const isMatch=await comparePassword(password,user.password)

        if(!isMatch){
            throw createHttpError(HttpStatus.FORBIDDEN,HttpResponse.INVALID_CREDNTIALS)
        }

        const payload={
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        }
        const {accessToken,refreshToken}=generateTokens(payload)
        return {accessToken,refreshToken,payload}
    }

    async  forgotPassword(email: string): Promise<string> {
        const isUserExist=await this.userRepo.findUserByEmail(email)

        if(!isUserExist){
            throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.USER_NOT_FOUND)
        }

        const secureToken=generateSecureToken()
        let key=`${redisPrefix.FORGOT_PASSWORD}:${email}`

        await sendToken(email,secureToken,'reset-password')
        const response=await redisClient.setEx(key,300,secureToken)

        if(!response){
            throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR,HttpResponse.SERVER_ERROR)
        }

        return email
        
    }
    async resetPassword(email: string, token: string, password: string): Promise<string> {
        let key=`${redisPrefix.FORGOT_PASSWORD}:${email}`

        const storedToken= await redisClient.get(key)
        console.log('stored ✅ redis',storedToken)
        if(!storedToken){
            throw createHttpError(HttpStatus.BAD_REQUEST,HttpResponse.TOKEN_NOT_FOUND)
        }

        if(storedToken!==token){
            throw createHttpError(HttpStatus.FORBIDDEN,HttpResponse.UNAUTHORIZED)
        }
        
        const hashedPassword=await hashPassword(password as string)
        
        const result=await this.userRepo.updateUserPassword(email,hashedPassword)

        if(!result){
            throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR,HttpResponse.SERVER_ERROR)
        }
        await redisClient.del(key)
        return result.email
    }


    async generateToken(user: IUser): Promise<{ accessToken: string; refreshToken: string;payload:JwtPayload }> {
         const payload={id:user._id,email:user.email,role:user.role}
         const {accessToken,refreshToken}=generateTokens(payload)
         return {accessToken,refreshToken,payload}
    }
}