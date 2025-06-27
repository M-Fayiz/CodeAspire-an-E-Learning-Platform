import { BaseRepository } from "../baseRepository";
import { User ,IUserModel} from "../../Models/userModel";
import { IUserRepo } from "../interface/IUserRepo";
import { Profile } from "passport-google-oauth20";
import { IUserRole } from "../../types/user.types";
import { use } from "passport";
import { Types } from "mongoose";

export class UserRepository extends BaseRepository<IUserModel> implements IUserRepo{


        constructor(){
            super(User)
        }
    async  createUser(user: IUserModel): Promise<IUserModel> {
        
        try{
         return await this.create(user)
            }catch(error){
         console.error(error)
         throw error
            }
    }

    async findUserByEmail(email: string): Promise<IUserModel | null> {
        try {
            return await this.model.findOne({email:email})
        } catch (error) {
            console.error(error)
            throw error
        }
    }
    async updateUserPassword(email:string,password:string):Promise<IUserModel|null>{
        try {
            return await this.findUserAndUpdate({email},{$set:{password:password}},{new :true})
        } catch (error) {
            throw error
        }
    }
    async findOrCreateUser(profile: Profile,role?:IUserRole): Promise<IUserModel | null> {
                let user=await this.findOne({
                    $or:[{googleId:profile.id},{email:profile.emails?.[0].value}]
                })

                if(!user){
                    user=await this.create({
                        googleId:profile.id,
                        email:profile.emails?.[0].value,
                        name:profile.displayName,
                        role:role
                    })
                }
                return user
    }

    async findAllUsers(): Promise<IUserModel[] | null> {
               const filter={role:{$ne:'admin'}}
               return this.model.find(filter).select('-password -googleId')
    }

    async blockUser(id:Types.ObjectId): Promise<IUserModel | null> {
              try {
                return this.model.findByIdAndUpdate(id,[{ $set: { isActive: { $not: "$isActive" } } }],{
                new: true,
                upsert: false,
                })
              } catch (error) {
                throw error
              }
    }
    async findUserById(id:Types.ObjectId):Promise<IUserModel|null>{
        return await this.findById(id)
    }
    


}