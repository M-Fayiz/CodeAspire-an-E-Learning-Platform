import { Document,Model,Types,FilterQuery,UpdateQuery, UpdateWriteOpResult, } from "mongoose";


export abstract class BaseRepository<T extends Document> {
    constructor(protected model:Model<T>) {}
    async findAll():Promise<T[]>{
        return this.model.find()
    }
    async findOne(filter:FilterQuery<T>):Promise<T | null>{
        return this.model.findOne(filter)
    }
    async create(data:Partial<T>):Promise<T>{
        console.log("Saving new document...");
        const document=new  this.model(data)
       return document.save()
    }
    async findById(id:Types.ObjectId):Promise<T|null>{
        return this.model.findById(id)
    }
    async findUserByEmail(email:string):Promise<T|null>{
        return this.model.findOne({email})
    }
    async findUserAndUpdate(filter:FilterQuery<T>,update:UpdateQuery<T>,options = { new: true }):Promise<T|null>{
            return this.model.findOneAndUpdate(filter,update,options)
    }
    async findByIDAndUpdate(id:Types.ObjectId,update:UpdateQuery<T>):Promise<T|null>{
        return this.model.findByIdAndUpdate(id,update,{upsert:true,new:true})
    }
    // async updateOne(filter:FilterQuery<T>,update:UpdateQuery<T>):Promise<T|null>{
    //     return this.model.updateOne(filter,update)
    // }
}
