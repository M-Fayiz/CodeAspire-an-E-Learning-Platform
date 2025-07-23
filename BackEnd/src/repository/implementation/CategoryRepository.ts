import { Types } from "mongoose";
import { CategoryModel } from "../../models/category.model";
import { ICategory } from "../../types/category.types";
import { BaseRepository } from "../baseRepository";
import { ICategoryRepository } from "../interface/ICategoryRepository";
import { parseObjectId } from "../../mongoose/objectId";


export class CategoryRepository extends BaseRepository<ICategory> implements ICategoryRepository{
    constructor(){
        super(CategoryModel)
    }

    async createCategory(title:string,slug:string,parentId:Types.ObjectId|null): Promise<ICategory|null> {
        
        return await this.create({title,slug,parentId})
    }
    async listCategories(): Promise<ICategory[] | null> {
        return await this.model.find().lean()
    }
    
}