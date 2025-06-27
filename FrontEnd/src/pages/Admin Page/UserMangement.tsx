import React, { useState, useMemo, useEffect } from 'react';
import {  Trash2,Users } from 'lucide-react';
import type{ IUserType } from '../../types/profile.type';


import { SearchAndFilter } from '../../components/admin-components/userMangement/SerchAndFilter';

import { TableHeader } from '../../components/common/TableComponents';

import { adminService } from '../../service/client/admin.service';
import { toastService } from '../../components/toast/ToastSystem';

import TableRow from '../../components/admin-components/userMangement/TableData';
// import { StatsCards } from '../components/admin-components/userMangement/StatusCard';


const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<IUserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

 
  const filteredUsers = useMemo(() => {
    if(!users) return []
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === '' || user.role === roleFilter;
      
      
      return matchesSearch && matchesRole
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  

   useEffect(()=>{
     async function fetchAllUsers(){
        try {
            const userData=await adminService.fetchAllUsers()
            setUsers(userData)
        } catch (error) {
            if(error instanceof Error){
                toastService.error(error.message)
            }
        }
      }
      fetchAllUsers()
   },[users])


  const handleDelete = async (id: string) => {
     try {
      const result=await adminService.blockUser(id)
      if(result){
        toastService.success( result ? 'User Unblocked Successfully' : 'User Blocked Successfully')
      }
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === result.id
            ? { ...user, isActive: result.isActive }
            : user
        )
      );
     } catch (error) {
      if(error instanceof Error){
        toastService.error(error.message)
      }
      
     }
  };

  // const handleView = (user: IUserType) => {
  //   console.log('View user:', user);
   
  // };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage mentors and learners in your platform</p>
          </div>
          
        </div>

       
        {/* <StatsCards users={users} /> */}

        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <TableHeader />
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user._id}
                    user={user}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
               
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;