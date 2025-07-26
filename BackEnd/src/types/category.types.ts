import { Types,Document } from "mongoose";


export interface ICategory extends Document<Types.ObjectId> {
  title: string;
  slug: string;
  parentId: string|Types.ObjectId | null;
  children?: ICategory[];
}

export interface ICategoryEdit {
  categoryId:string;
  title:string;
  parentId:string; 
}


export interface ITree {
  key:string,
  label:string,
  slug:string,
  parent?:string
  children:ITree[]
}


