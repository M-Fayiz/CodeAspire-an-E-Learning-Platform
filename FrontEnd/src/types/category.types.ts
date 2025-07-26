export interface ICategory {
  _id: string;
  title: string;
  parent?: string;
  children: ICategory[];
}

export interface ITree {
  key:string,
  label:string,
  slug:string,
  parent?:string
  children:ITree[]
}

  export interface ICategoryEdit {
  slug:string;
  title:string;
  parentId:string; 
}