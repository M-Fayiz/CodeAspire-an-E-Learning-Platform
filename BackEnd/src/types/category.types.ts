import { Types,Document } from "mongoose";


export interface ICategory extends Document<Types.ObjectId> {
  title: string;
  slug: string;
  parentId: string|Types.ObjectId | null;
  children?: ICategory[];
}


export interface ITree {
  key:string,
  label:string,
  parent?:string
  children:ITree[]
}


