import React from "react";


import type { UserRoleType } from "@/types/auth.types";
import type { ITransactionDTO } from "@/types/transaction.type";


interface TransactionTableProps {
  transactions: ITransactionDTO[];
  role: UserRoleType;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  role,
}) => {
 
  return (
    <div className="w-full overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-right">Amount</th>
            <th className="px-4 py-3 text-right">
              {role === "admin" ? "Admin Share" : "Your Share"}
            </th>
              {role === "admin" &&(
                <th className="px-4 py-3 text-right">
                    Mentor Share
                </th>
              )}
           
            <th className="px-4 py-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-4 py-6 text-center text-gray-500"
              >
                No transactions found
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr
                key={tx._id}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3 text-gray-600">
                  {tx.date
                    ? new Date(tx.date).toLocaleDateString()
                    : "-"}
                </td>

                <td className="px-4 py-3 font-medium text-gray-800">
                  {tx.paymentTypes.replace("_", " ")}
                </td>

                <td className="px-4 py-3 text-right font-semibold">
                  ₹{tx.amount}
                </td>
                     {role === "admin" &&(
                        <th className="px-4 py-3 text-right">
                          ₹{tx.mentorShare}
                        </th>
                    )}
                <td className="px-4 py-3 text-right font-semibold text-gray-900">
                  ₹{tx.share}
                </td>

               

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium
                      ${
                        tx.status === "success"
                          ? "bg-gray-900 text-white"
                          : tx.status === "refunded"
                          ? "bg-gray-300 text-gray-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                  >
                    {tx.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
