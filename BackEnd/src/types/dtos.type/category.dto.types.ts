export interface ICategoryDTO {
  _id: string;
  title: string;
  slug: string;
  parent: string | null;
}

export interface ICaregoryTreeDTO extends ICategoryDTO {
  children: ICaregoryTreeDTO[];
}