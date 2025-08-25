
import { ICategory } from "../types/category.types";
import { ICategoryDTO } from "../types/dtos.type/dto.types";


export function CategoryDTO(category:ICategory):ICategoryDTO{
    return {
        _id:String(category._id),
        title:category.title,
        slug:category.slug,
        parentId:String(category.parentId),
        children: category.children ? category.children.map(child => CategoryDTO(child)) : [],
    }
}