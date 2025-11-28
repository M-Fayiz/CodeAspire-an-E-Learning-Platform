import { FilterQuery, Types } from "mongoose";
import { ITransaction } from "../../types/transaction.type";
import { IRevenueAggregationResult } from "../../types/courseDashboard.type";
import { IMentorTotalRevanue } from "../../types/mentorDashboard.types";
import { ITransactionModel } from "../../models/transaction.model";
import { graphPrps, revanueGrapsh, SourceOfRevanye } from "../../types/adminDahsboard.type";


export interface ITransactionRepository {
  createTransaction(transactionData: ITransaction): Promise<ITransaction>;
  getCourseDashboardRevenue(
    courseId: Types.ObjectId,
  ): Promise<IRevenueAggregationResult[]>;
  getMentorTotalRevenue(
    mentorId: Types.ObjectId,
  ): Promise<IMentorTotalRevanue[]>;
  getMentorRevanueONSlot(filter:FilterQuery<ITransactionModel>): Promise<graphPrps[]>;
  getMentorRevanueONCourse(filter:FilterQuery<ITransactionModel>): Promise<graphPrps[]>;
  getAdminRevenue():Promise<SourceOfRevanye[]>
  
}
