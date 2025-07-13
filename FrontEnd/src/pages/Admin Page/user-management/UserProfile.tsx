import React, { useState } from 'react';
import { Activity, Mail, Phone, Clock, TrendingUp, AlertTriangle, CheckCircle, XCircle, Ban} from 'lucide-react';
// import type { IUserType } from '../../../types/profile.type';
import { useLoaderData } from 'react-router';
import { adminService } from '../../../service/client-API/admin.service';
import { toastService } from '../../../config/Toast.config';
import type { IUserType } from '../../../types/profile.type';


const AdminUserProfile: React.FC = () => {
  const userData = useLoaderData() as IUserType
  const [profileData,setProfileData]=useState(userData)

  const handleUnblockUser=async()=>{
    try {
      const result=await adminService.blockUser(userData._id)
      if(result){
        toastService.success(result.isActive?'User Unblocked Successfully':'User Blocked Successfully')
        setProfileData((prv)=>({...prv,isActive:result.isActive}))
      }
      
    } catch (error) {
      if(error instanceof Error){
        toastService.error(error.message)
      }
    }
  }

  const getStatusColor = (status: boolean) => {
    switch (status) {
      case true: return 'bg-green-100 text-green-800';
      case false: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: boolean) => {
    switch (status) {
      case true: return <CheckCircle className="w-4 h-4" />;
      case false: return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img
                    src={profileData.imageURL}
                    alt={profileData.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2">
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(profileData.isActive)}`}>
                      {getStatusIcon(profileData.isActive)}
                      {profileData.isActive?'Active':'blocked'}
                      <span className="capitalize">{profileData.isActive}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
                  <p className="text-gray-600 mt-1">{profileData.role}</p>
                  {/* <p className="text-sm text-gray-500 mt-2">User ID: {user.id}</p> */}
                  {/* <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {formatDate(profileData.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                    
                    </div>
                  </div> */}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleUnblockUser}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-colors
                    ${profileData.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                  `}
                >
                  {profileData.isActive ? (
                    <>
                      <Ban className="w-4 h-4" />
                      <span>Block User</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Unblock User</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{profileData.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900">{profileData.phone}</p>
                  </div>
                </div>
                
              </div>
            </div>
          </div>

         
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Performance Overview</h2>
              
             
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Total Tasks</p>
                      {/* <p className="text-2xl font-bold text-blue-900">{user.performance.totalTasks}</p> */}
                    </div>
                    <Activity className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Completed</p>
                      {/* <p className="text-2xl font-bold text-green-900">{user.performance.completedTasks}</p> */}
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-600 font-medium">Pending</p>
                      {/* <p className="text-2xl font-bold text-yellow-900">{user.performance.pendingTasks}</p> */}
                    </div>
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Success Rate</p>
                      {/* <p className="text-2xl font-bold text-purple-900">{user.performance.successRate}%</p> */}
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Rating & Hours</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Rating</span>
                    <div className="flex items-center space-x-1">
                      {/* <span className="font-semibold">{user.performance.averageRating}</span> */}
                      <span className="text-yellow-500">★</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Hours</span>
                    {/* <span className="font-semibold">{user.performance.totalHours}h</span> */}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">Completion Rate</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      // style={{ width: `${(user.performance.completedTasks / user.performance.totalTasks) * 100}%` }}/
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {/* {Math.round((user.performance.completedTasks / user.performance.totalTasks) * 100)}% of tasks completed */}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div> 
      </div>
    </div>
  );
};

export default AdminUserProfile;