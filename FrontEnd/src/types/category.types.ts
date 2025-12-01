export interface ICategory {
  _id: string;
  title: string;
  parent?: string;
  children: ICategory[];
}

export interface ICategoryEdit {
  _id: string;
  title: string;
  parentId: string|null;
}
