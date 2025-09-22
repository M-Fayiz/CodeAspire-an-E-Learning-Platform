import { ITransaactionModel, transactionModel } from "../../models/transaction.model";
import { ITransaction } from "../../types/transaction.type";
import { BaseRepository } from "../baseRepository";
import { ITransactionRepository } from "../interface/ITransactionRepository";

export class TransactionRepositoy extends BaseRepository<ITransaactionModel> implements ITransactionRepository{
    constructor(){
        super(transactionModel)
    }
    async createTransaction(transactionData:ITransaction): Promise<ITransaction> {
        return this.create(transactionData)
    }
}
