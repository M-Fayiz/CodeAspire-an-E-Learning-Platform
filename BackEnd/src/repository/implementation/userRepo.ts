import { BaseRepository } from "../baseRepository";
import { User ,IuserModel} from "../../Models/userModel";
import { IUserRepo } from "../interface/IUserRepo";

export class UserRepository extends BaseRepository<IuserModel> implements IUserRepo{


    constructor(){
        super(User)
    }
         async  createUser(user: IuserModel): Promise<IuserModel> {
        
               try{
                return await this.create(user)
               }catch(error){
                console.error(error)
                throw error
               }
           }
           async findUserByEmail(email: string): Promise<IuserModel | null> {
               try {
                return await this.model.findOne({email:email})
               } catch (error) {
                console.error(error)
                throw error
               }
           }
}