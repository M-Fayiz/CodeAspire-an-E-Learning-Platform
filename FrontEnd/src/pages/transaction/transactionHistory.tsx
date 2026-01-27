import ManagementLayout from "@/components/layout/ManagementLayout";
import PaginationRounded from "@/components/ui/Pagination";
import { useAuth } from "@/context/auth.context";
import TransactionTable from "@/features/transaction/transactionTable"
import { OrderService } from "@/service/order.service";
import type { UserRoleType } from "@/types/auth.types";
import { type ITransactionDTO } from "@/types/transaction.type";
import { History } from "lucide-react";
import { useEffect, useState } from "react";


    
const TransactionPage=()=>{
    const{user}=useAuth()
    const [transaction,setTransaction]=useState<ITransactionDTO[]>([])
    const [page,setPage]=useState(1)
    const [totalPage,setTotalPage]=useState(1)
    useEffect(()=>{
        (async()=>{
            const data=await OrderService.getTransactionHistory(Number(page))
            setTransaction(data.transactionHistory)
            setTotalPage(data.totalPage)
        })()
    },[page])
      const handlePage = (_e: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
    return(
        <>
        <ManagementLayout title="Transaction History" icon={<History size={32}/>}>

            <TransactionTable role={user?.role as UserRoleType}
            transactions={transaction}
            />
             <PaginationRounded
          currentPage={page}  
          onPageChange={handlePage}
          totalPages={totalPage}
        />
        </ManagementLayout>
        </>
    )
}
export default TransactionPage