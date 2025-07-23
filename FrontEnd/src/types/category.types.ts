export interface ICategory {
  _id: string;
  title: string;
  parent?: string;
  children: ICategory[];
}

export interface ITree {
  key:string,
  label:string,
  parent?:string
  children:ITree[]
}