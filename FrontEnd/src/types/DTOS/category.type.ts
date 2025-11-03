export interface ICategoryTreeDTO {
  _id: string;
  label: string;
  slug: string;
  parent?: string;
  children?: ICategoryTreeDTO[];
}
