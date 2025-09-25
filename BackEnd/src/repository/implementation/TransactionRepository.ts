import { Types } from "mongoose";
import {
  ITransaactionModel,
  transactionModel,
} from "../../models/transaction.model";
import { ITransaction } from "../../types/transaction.type";
import { BaseRepository } from "../baseRepository";
import { ITransactionRepository } from "../interface/ITransactionRepository";
import { IRevenue } from "../../types/dtos.type/CourseDashboard.dto.type";
import { IRevenueAggregationResult } from "../../types/CourseDashboard.type";

export class TransactionRepositoy
  extends BaseRepository<ITransaactionModel>
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
  async getDashboardRevenue(
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
}
