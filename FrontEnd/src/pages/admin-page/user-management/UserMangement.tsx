import React, { useState, useEffect } from "react";

import type { IUserType } from "../../../types/users.type";
import { TableHeader } from "../../../components/common/TableComponents";
import { adminService } from "@/service/admin/admin.service";
import TableRow from "../../../features/admin/userMangement/TableData";
import PaginationRounded from "../../../components/ui/Pagination";
import useDebounce from "@/hooks/useDebounce";
import { toast } from "sonner";
import { useSearchPagination } from "@/hooks/useSearchQuery";
import { Search } from "lucide-react";

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
        if (error instanceof Error) {
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
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handlePages = (_e: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage mentors and learners in your platform
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6 bg-white p-3 rounded-lg shadow-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search users"
            className="w-full pl-11 pr-4 py-2.5 text-sm border border-gray-300 rounded-md
        focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        {/* Table */}
        <div className="w-full bg-white shadow rounded-lg overflow-hidden">
          {users.length === 0 ? (
            <div className="p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Users Found
              </h3>
              <p className="text-gray-500">
                There are no users matching your search.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
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
      </div>
    </div>
  );
};

export default UserManagement;
