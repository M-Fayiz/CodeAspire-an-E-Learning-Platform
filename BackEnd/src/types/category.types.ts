import { Types } from "mongoose";

export interface ICategory {
  title: string;
  parentId: string | Types.ObjectId | null;
  children?: ICategory[];
}

export interface ICategoryEdit {
  categoryId: string;
  title: string;
  parentId: string;
}
