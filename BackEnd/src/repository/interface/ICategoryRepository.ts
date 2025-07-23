import { Types } from "mongoose";
import { ICategory } from "../../types/category.types";



export interface ICategoryRepository{
    createCategory(title:string,slug:string,parentId:Types.ObjectId|null):Promise<ICategory|null>
    listCategories():Promise<ICategory[]|null>
}