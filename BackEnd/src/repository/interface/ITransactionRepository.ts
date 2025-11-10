import { Types } from "mongoose";
import { ITransaction } from "../../types/transaction.type";
import { IRevenueAggregationResult } from "../../types/courseDashboard.type";
import { IMentorTotalRevanue } from "../../types/mentorDashboard.types";
import { IAdminRevenue } from "../../types/adminDahsboard.type";

export interface ITransactionRepository {
  createTransaction(transactionData: ITransaction): Promise<ITransaction>;
  getCourseDashboardRevenue(
    courseId: Types.ObjectId,
  ): Promise<IRevenueAggregationResult[]>;
  getMentorTotalRevenue(
    mentorId: Types.ObjectId,
  ): Promise<IMentorTotalRevanue[]>;
  getAdminRevenue(): Promise<IAdminRevenue[]>;
}
