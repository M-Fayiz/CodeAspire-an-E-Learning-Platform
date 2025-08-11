import React, { useState } from 'react';
import { Activity, Mail, Phone, AlertTriangle, CheckCircle, XCircle, Ban, User, MapPin, ExternalLink, FileText} from 'lucide-react';
// import type { IUserType } from '../../../types/profile.type';
import { useLoaderData } from 'react-router';
import { adminService } from '@/service/client-API/admin/admin.service';
import { toastService } from '../../../config/Toast.config';
import type { AnyUser, IUserType } from '../../../types/users.type';


const AdminUserProfile: React.FC = () => {
  const userData = useLoaderData() as AnyUser
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

  const approveMentor=async()=>{
    try {
      const result=await adminService.approveMentor(profileData._id)
      console.log('is Approved',result)
      if(result){
        // setUser((prv)=>({...prv,isApproved}))
        toastService.success('menter has been approved')
      }
    } catch (error) {
       if(error instanceof Error){
        toastService.error(error.message)
       }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-sg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {profileData.imageURL?(<img
                    src={profileData.imageURL}
                    alt={profileData.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />):(<img className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />)}
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
        <div className='bg-white rounded-sm'>
         <div className="p-3 space-y-6">
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">{profileData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">{profileData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">{'currentUser.location'}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-600">Joined {'profileData'}</span>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-4">
            <h5 className="text-sm font-semibold text-slate-900 mb-3">bio</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <p className="text-sm text-slate-600">{profileData.bio}</p>
            </div>
          </div>

          {profileData.role=='mentor'&&(
            <div className="bg-white border  rounded-sm p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {profileData.expertise&&profileData.expertise.map((skill, index) => (
                <span key={index} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          )}
          {profileData.role=='mentor'&&(
          <div className="bg-white border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Social Links</h3>
            <div className="flex gap-3">
              {Object.entries(profileData.socialLinks ?? {}).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm capitalize">{platform}</span>
                </a>
              ))}
            </div>
          </div>
            )}
            {profileData.role=='mentor'&&(
              <div className=" bg-slate-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Admin Actions</h3>
            <div className='flex justify-between'>
            <div className="flex flex-wrap gap-2">
              {profileData.resume?(

              <button onClick={()=>window.open(profileData.resume, '_blank')} className="flex items-center gap-2 px-3 py-2 text-sm bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-colors">
                <FileText className="w-4 h-4" />
                View Resume
              </button>
              ):(<p>resume not available</p>)}
              <button className="flex items-center gap-2 px-3 py-2 text-sm bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-colors">
                <Activity className="w-4 h-4" />
                View Activity
              </button>
            </div>
            <div className='flex '>
            <div className='flex flex-wrap gap-2'>
              <button onClick={approveMentor} type="button" className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800">Approved</button>
            </div>
            <div className='flex flex-wrap gap-2'>
              <button onClick={approveMentor} type="button" className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800">Approved</button>
            </div>
            </div>
            </div>
          </div>
           )}
         </div> 
        </div> 
      
      </div>
    </div>
  );
};

export default AdminUserProfile;