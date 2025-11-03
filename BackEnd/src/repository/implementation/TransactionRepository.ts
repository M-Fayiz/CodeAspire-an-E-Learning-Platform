import { Types } from "mongoose";
import {
  ITransactionModel,
  transactionModel,
} from "../../models/transaction.model";
import { ITransaction } from "../../types/transaction.type";
import { BaseRepository } from "../baseRepository";
import { ITransactionRepository } from "../interface/ITransactionRepository";
import { IRevenueAggregationResult } from "../../types/courseDashboard.type";
import { IMentorTotalRevanue } from "../../types/mentorDashboard.types";
import {  IAdminRevenue } from "../../types/adminDahsboard.type";

export class TransactionRepositoy
  extends BaseRepository<ITransactionModel>
  implements ITransactionRepository
{
  constructor() {
    super(transactionModel);
  }
  async createTransaction(
    transactionData: ITransaction,
  ): Promise<ITransaction> {
    return this.create(transactionData);
  }
  async getCourseDashboardRevenue(
    courseId: Types.ObjectId,
  ): Promise<IRevenueAggregationResult[]> {
    console.log(courseId);
    return await this.aggregate<IRevenueAggregationResult>([
      { $match: { courseId } },
      {
        $group: {
          _id: null,
          adminSum: { $sum: "$adminShare" },
          mentorSum: { $sum: "$mentorShare" },
        },
      },
    ]);
  }
  async getMentorTotalRevenue(
    mentorId: Types.ObjectId,
  ): Promise<IMentorTotalRevanue[]> {
    return await this.aggregate<IMentorTotalRevanue>([
      {
        $match: {
          mentorId: mentorId,
        },
      },
      {
        $group: {
          _id: null,
          revenue: {
            $sum: "$mentorShare",
          },
        },
      },
    ]);
  }
  async getAdminRevenue(): Promise<IAdminRevenue[]> {
  return this.aggregate<IAdminRevenue>([
    {
      $group: {
        _id: null,
        revenue: { $sum: '$adminShare' }
      }
    },
    {
      $unwind:"$revenue"
    }
  ]);
}

}
