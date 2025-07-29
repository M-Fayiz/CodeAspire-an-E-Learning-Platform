
import { parseObjectId } from "../../mongoose/objectId";
import { ICategoryRepository } from "../../repository/interface/ICategoryRepository";
import { ICategoryService } from "../interface/ICategoryService";
import slugify from "slugify";
import { ICategory ,ICategoryEdit,ICaregoryTree} from "../../types/category.types";
import {startCase} from 'lodash';
import { createHttpError } from "../../utility/http-error";
import { HttpStatus } from "../../const/http-status";
import { HttpResponse } from "../../const/error-message";


export class CategoryService implements ICategoryService{

    constructor(private _categoryRepository:ICategoryRepository){}

    async createCategory(title: string, parent: string | null): Promise<ICategory|null> {
        let  parentId =parent? parseObjectId(parent):null
        const isExist=await this._categoryRepository.findCategory(title)
        if(isExist){
            throw createHttpError(HttpStatus.CONFLICT,HttpResponse.ITEM_EXIST)
        }
        const categorySlug = slugify(title, { lower: true, strict: true });
        title=startCase(title)
        return await this._categoryRepository.createCategory(title, categorySlug, parentId);
    }
    async listCategories(): Promise<ICaregoryTree[] | null> {
       
       const categories= await this._categoryRepository.listCategories()
       let map=new Map()
       categories?.forEach(cat => {
        map.set(cat._id.toString(), {
            key: cat._id.toString(),      
            label: cat.title,
            slug:cat.slug, 
            parent:null,             
            children: []                  
        });
        });
       const tree:ICaregoryTree[]=[];

        categories?.forEach(cat => {
        const node = map.get(cat._id.toString());
        if (cat.parentId) {
            const parent = map.get(cat.parentId.toString());
            
            if (parent) {
                node.parent=parent.key
            parent.children.push(node);  
            }
        } else {
            tree.push(node);               
        }
       });
     
       return tree
    }
    async editCategory(slug: string, title: string,parentId:string|null): Promise<ICategory | null> {
        title=startCase(title)
        const editedResult=await this._categoryRepository.editCategory(slug,title,parentId)
        if(!editedResult){
            throw createHttpError(HttpStatus.BAD_REQUEST,HttpResponse.INVALID_CREDNTIALS)
        }
        console.log('edited resukt',editedResult)
        return editedResult
    }
}