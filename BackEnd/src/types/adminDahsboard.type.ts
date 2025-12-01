import { IPaymentTypes } from "./transaction.type";

export interface IAdminRevenue {
  _id: null;
  revenue: number;
}

export interface graphPrps {
  date: string;
  value: number;
}
export interface SourceOfRevanye {
  _id: IPaymentTypes;
  value: number;
}
