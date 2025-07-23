import { ICategory, ITree } from "../../types/category.types";


export interface ICategoryService{
    createCategory(title:string,parent:string|null):Promise<ICategory|null>
    listCategories():Promise<ITree[]|null>
}