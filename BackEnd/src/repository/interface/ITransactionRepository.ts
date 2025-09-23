import { ITransaction } from "../../types/transaction.type";

export interface ITransactionRepository {
  createTransaction(transactionData: ITransaction): Promise<ITransaction>;
}
