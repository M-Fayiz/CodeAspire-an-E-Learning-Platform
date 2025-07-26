import { ICategory, ICategoryEdit, ITree } from "../../types/category.types";


export interface ICategoryService{
    createCategory(title:string,parent:string|null):Promise<ICategory|null>
    listCategories():Promise<ITree[]|null>
    editCategory(slug: string, title: string,parentId:string|null):Promise<ICategory|null>
}