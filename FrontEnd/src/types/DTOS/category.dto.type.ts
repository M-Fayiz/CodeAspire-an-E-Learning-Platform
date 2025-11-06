export interface ICategoryDTO {
  _id: string;
  label: string;
  slug: string;
  parent?: string;
  children?: ICategoryDTO[];
}
