import React, { useState, useEffect } from "react";

import type { IUserType } from "../../../types/users.type";
import { TableHeader } from "../../../components/common/TableComponents";
import { adminService } from "@/service/admin/admin.service";
import TableRow from "../../../features/admin/userMangement/TableData";
import PaginationRounded from "../../../components/ui/Pagination";
import useDebounce from "@/hooks/useDebounce";
import { toast } from "sonner";
import { useSearchPagination } from "@/hooks/useSearchQuery";
import { Search, Users2 } from "lucide-react";
import { ApiError } from "@/utility/apiError.util";
import ManagementLayout from "@/components/layout/ManagementLayout";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<IUserType[]>([]);

  const { search, page, setSearch, setPage } = useSearchPagination();
  const [searchInput, setSearchInput] = useState(search);
  const [totalPage, setTotalPage] = useState(1);
  const debouncedSearch = useDebounce(searchInput, 200);
  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    async function fetchAllUsers() {
      try {
        const userData = await adminService.fetchAllUsers(page, search);
        setUsers(userData.users);
        setTotalPage(userData.totalPage);
      } catch (error) {
        if (error instanceof ApiError) {
          toast.error(error.message);
        }
      }
    }

    fetchAllUsers();
  }, [page, search]);

  const handleDelete = async (id: string) => {
    try {
      const result = await adminService.blockUser(id);

      if (result) {
        toast.success(
          result ? "User Unblocked Successfully" : "User Blocked Successfully",
        );
      }
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === result.id ? { ...user, isActive: result.isActive } : user,
        ),
      );
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    }
  };

  const handlePages = (_e: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
  <ManagementLayout
    title="User Management"
    description="Manage mentors and learners in your platform"
    icon={<Users2 size={32}/>}
  >
   
    <div className="relative mb-6">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search users"
        className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>


    <div className="w-full bg-white sm:shadow sm:rounded-lg overflow-hidden">
      {users.length === 0 ? (
        <div className="p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Users Found
          </h3>
          <p className="text-gray-500">
            There are no users matching your search.
          </p>
        </div>
      ) : (
        <div className="relative w-full overflow-x-scroll sm:overflow-x-visible">
          <table className="min-w-[900px] sm:min-w-full divide-y divide-gray-200">
            <TableHeader />
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  user={user}
                  onDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

    {/* Pagination */}
    {users.length > 0 && (
      <div className="mt-6 flex justify-center">
        <PaginationRounded
          currentPage={page}
          totalPages={totalPage}
          onPageChange={handlePages}
        />
      </div>
    )}
  </ManagementLayout>
);

};

export default UserManagement;
