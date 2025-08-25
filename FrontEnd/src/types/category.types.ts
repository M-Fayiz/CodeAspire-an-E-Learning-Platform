export interface ICategory {
  _id: string;
  title: string;
  parent?: string;
  children: ICategory[];
}

export interface ICategoryTree {
  key: string;
  label: string;
  slug: string;
  parent?: string;
  children?: ICategoryTree[];
}

export interface ICategoryEdit {
  slug: string;
  title: string;
  parentId: string;
}

export interface ICategoryDTO {
  _id: string;
  title: string;
  slug: string;
  parentId: string | null;
  children?: ICategoryDTO[];
}
