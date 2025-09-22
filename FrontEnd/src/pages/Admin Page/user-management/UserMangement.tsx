import React, { useState, useEffect } from "react";

import type { IUserType } from "../../../types/users.type";
import { TableHeader } from "../../../components/common/TableComponents";
import { adminService } from "@/service/client-API/admin/admin.service";
import { toastService } from "../../../components/toast/ToastSystem";
import TableRow from "../../../features/admin/userMangement/TableData";
// import { StatsCards } from '../components/admin-components/userMangement/StatusCard
import PaginationRounded from "../../../components/ui/Pagination";
import type { SearchQuery } from "../../../types/parser.types";
import useDebounce from "@/hooks/useDebounce";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<IUserType[]>([]);
  const [just, setJust] = useState("");
  const [search, setSearch] = useState<SearchQuery>({
    name: "",
    role: "",
    isActive: "",
  });

  // const [search,setSearch]=use

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const debounced = useDebounce(just, 1000);
  useEffect(() => {
    async function fetchAllUsers() {
      try {
        const userData = await adminService.fetchAllUsers(page, debounced);
        setUsers(userData.users);
        setTotalPage(userData.totalPage);
      } catch (error) {
        if (error instanceof Error) {
          toastService.error(error.message);
        }
      }
    }

    fetchAllUsers();
  }, [page, just]);

  const handleDelete = async (id: string) => {
    try {
      const result = await adminService.blockUser(id);

      if (result) {
        toastService.success(
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
        toastService.error(error.message);
      }
    }
  };

  const handlePages = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setSearch((prv) => ({ ...prv, [name]: value }));

    setPage(1);
  };
  const handleDebouncing = (value: string) => {
    setJust(value);
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage mentors and learners in your platform
            </p>
          </div>
        </div>

        {/* <StatsCards users={users} /> */}

        {/* <SearchAndFilter searchTerm={search} onSearchChange={handleSearch} /> */}
        <input
          className="bg-grey-200 h-[10px]"
          type="text"
          value={just}
          onChange={(e) => handleDebouncing(e.target.value)}
        />

        <div className="flex flex-col justify-center items-center">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {users.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Users Found
                </h3>
                <p className="text-gray-500">
                  There are no users matching your current search criteria.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <TableHeader />
                  <tbody className="bg-white divide-y divide-gray-200">
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

          {users.length > 0 && (
            <PaginationRounded
              currentPage={page}
              totalPages={totalPage}
              onPageChange={handlePages}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
