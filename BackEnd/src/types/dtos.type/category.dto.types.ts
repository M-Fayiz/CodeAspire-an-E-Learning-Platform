export interface ICategoryDTO {
  _id: string;
  title: string;
  parent: string | null;
}

export interface ICaregoryTreeDTO extends ICategoryDTO {
  children: ICaregoryTreeDTO[];
}
