import { Types } from "mongoose";
import { ITransaction } from "../../types/transaction.type";
import { IRevenueAggregationResult } from "../../types/CourseDashboard.type";

export interface ITransactionRepository {
  createTransaction(transactionData: ITransaction): Promise<ITransaction>;
  getDashboardRevenue(
    courseId: Types.ObjectId,
  ): Promise<IRevenueAggregationResult[]>;
}
