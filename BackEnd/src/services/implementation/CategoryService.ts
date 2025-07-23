
import { parseObjectId } from "../../mongoose/objectId";
import { ICategoryRepository } from "../../repository/interface/ICategoryRepository";
import { ICategoryService } from "../interface/ICategoryService";
import slugify from "slugify";
import { ICategory ,ITree} from "../../types/category.types";
import {startCase} from 'lodash';


export class CategoryService implements ICategoryService{

    constructor(private _categoryRepository:ICategoryRepository){}

    async createCategory(title: string, parent: string | null): Promise<ICategory|null> {
        let  parentId =parent? parseObjectId(parent):null
        const categorySlug = slugify(title, { lower: true, strict: true });
        title=startCase(title)
        
        return await this._categoryRepository.createCategory(title, categorySlug, parentId);
    }
    async listCategories(): Promise<ITree[] | null> {
       
       const categories= await this._categoryRepository.listCategories()
       let map=new Map()
       categories?.forEach(cat => {
        map.set(cat._id.toString(), {
            key: cat._id.toString(),      
            label: cat.title, 
            parent:null,             
            children: []                  
        });
        });
       const tree:ITree[]=[];

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
       console.log('categories',tree)
       return tree
    }
}