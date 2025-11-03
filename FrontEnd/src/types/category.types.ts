export interface ICategory {
  _id: string;
  title: string;
  parent?: string;
  children: ICategory[];
}

export interface ICategoryEdit {
  slug: string;
  title: string;
  parentId: string;
}

