import { BaseRepository } from "../baseRepository";
import { UserModel ,IUserModel, IMenterModel, ILearnerModel, IAdminModel} from "../../models/user.model";
import { IUserRepo } from "../interface/IUserRepo";
import { Profile } from "passport-google-oauth20";
import { IAdmin, ILearner, IMentor, IUserRole, searchProps } from "../../types/user.types";
import { Types, UpdateQuery } from "mongoose";
import { buildUserFilter } from "../../utility/searchQuery";

export class UserRepository extends BaseRepository<IUserModel> implements IUserRepo{


    constructor(){
        super(UserModel)
    }
    async  createUser(user: IUserModel): Promise<IUserModel> {
        try {
            const createdUser=await this.create(user)
           return createdUser
        } catch (error) {
            throw error
        }
        
    }

    async findUserByEmail(email: string): Promise<IUserModel|IMenterModel|ILearnerModel|IAdminModel | null> {
        try {
             const user = await this.model.findOne({ email }).lean();
             if(!user) return null
            switch(user?.role){
                case 'mentor':
                    return user as unknown as IMenterModel
                case 'learner':
                    return user as unknown as  ILearnerModel
                case 'admin':
                    return user as IAdminModel
                default :
                return user as IUserModel        

            }
           
        } catch (error) {
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

    async findAllUsers(limit:number,skip:number,searchQuery:searchProps): Promise<IUserModel[] | null> {
        try {           
            const filter=buildUserFilter(searchQuery)
            return this.model.find(filter).select('-password -googleId').skip(skip).limit(limit)
        } catch (error) {
            throw error
        }
    }

    async findUserCount(searchQuery: searchProps): Promise<number | 0> {
        try {
            const filter=buildUserFilter(searchQuery)
            return this.model.countDocuments(filter)
        } catch (error) {
            throw error
        }
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

    async userProfilePictureUpdate(id: Types.ObjectId, imageURL: string): Promise<IUserModel | null> {
        return await this.model.findByIdAndUpdate(id,{profilePicture:imageURL},{new:true})
    }
    async updateMentorStatus(id: Types.ObjectId,status:string): Promise<IUserModel| null> {
        return await this.findByIDAndUpdate(id,{ApprovalStatus:status})
    }
}