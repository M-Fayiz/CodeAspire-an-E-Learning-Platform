import React, { useEffect, useState } from 'react';
import { User, Phone, Save, Edit2, Lock, Camera } from 'lucide-react';
// import ProfileImage from '../../components/profile/ProfileImage';
import { PasswordChangeForm } from '../../components/profile/ChangePassword';
import RoleSpecificFields from '../../components/profile/ProfileRole';
import type { IUserType } from '../../types/profile.type';
import { useAuth } from '../../context/auth.context';
import { ProfileTabs } from '../../components/profile/ProfileUI/Profile-Taps';
export type TapsComp='security'|'profile'|'information'
import { InputField,TextareaField } from '../../components/profile/ProfileUI/ProfileInput';
import RoleBadge from '../../components/profile/ProfileUI/RoleBadge';
import UserService from '../../service/client-API/user.service';
import { toastService } from '../../components/toast/ToastSystem';
import { validateFiles } from '../../utility/validateForm';
import { S3BucketUtil } from '../../utility/S3Bucket.util';



const ProfileManagement: React.FC = () => {

  const [profile, setProfile] = useState<IUserType>({
  _id: '',
  email: '',
  name: '',
  phone: '',
  role: 'learner',
  bio: '',
  expertise: [],
  mentorRating: 0,
  profilePicture: '',
  isActive: true, 
});


  const {user,checkAuth}=useAuth()
  const [isEditing, setIsEditing] = useState(false);
  const [originalProfile, setOriginalProfile] = useState<IUserType>(profile);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [fileError,setFileError]=useState('')
  const [activeTab,setActiveTab]=useState<TapsComp>('profile')
  const [signedImageUrl, setSignedImageUrl] = useState<string>('');

  const handleEdit = () => {
    setOriginalProfile({ ...profile });
    setIsEditing(true);
  };
 
  useEffect(() => {
  async function fetchUserData() {
    try {
      if (!user) {
        checkAuth();
        return;
      }

      const result = await UserService.fetchProfile(user.email);
      if (result) {
        if (result.profilePicture) {
          const  get_fileURL  = await S3BucketUtil.getPreSignedURL(result.profilePicture);
          setSignedImageUrl(get_fileURL);
          setProfile(result);
          setOriginalProfile(result); 
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toastService.error(error.message);
      }
    }
  }

  fetchUserData();
  }, []);


  const handleSave = () => {
    console.log('Saving profile:', profile);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };



  const handleInputChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        const {name,value}=e.target
       setProfile((prv)=>({...prv,[name]:value}))

         let errorMessage = '';
  if (name === 'phone') {
    if (!/^\d{10}$/.test(value)) {
      errorMessage = 'Phone number must be exactly 10 digits';
    }
  }

  setErrors((prev) => ({
    ...prev,
    [name]: errorMessage,
  }));

  let kk=Object.values(errors).some((msg) => msg)
  console.log(errors,kk)

  }

  const handleTabs=(tab:TapsComp)=>{ 
    setActiveTab(tab)
  }
  const handleProfilePictureUpdate =async (file:File) => {
    try {
      const result=await S3BucketUtil.putPreSignedURL(file)
      const fileURL=await UserService.uploadImageIntoS3(result.uploadURL,result.fileURL,file,user!.id)
      console.log('file ',fileURL)
      if(fileURL){
        setProfile((prv)=>({...prv,profilePicture:fileURL}))
        console.log(profile)
      }
    } catch (error) {
      if(error instanceof Error){
         toastService.error(error.message)
      }
    }    
  };

 const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file ) {
      const validatedError=validateFiles(file.type,'image')
      if(validatedError){
       
        setFileError(validatedError)
        return
      }
      setFileError('')
     handleProfilePictureUpdate(file)
    }
  };
 

  

  return (
    <div className="max-w-4xl mx-auto p-5 space-y-2">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
           <div className=" relative flex flex-col items-center">
            {/* Avatar */}
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shadow-md">
                {profile.profilePicture ? (
                  <img src={signedImageUrl} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-1/2 h-1/2 text-gray-400" />
                )}
                <label className="absolute bottom-0 right-2 bg-blue-500 p-1 rounded-full cursor-pointer hover:bg-blue-600 transition duration-200 shadow-md">
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Error Message (properly aligned) */}
              {fileError && (
                <p className="text-[11px] text-red-500 absolute top-23 left-0 bg-red-100 px-3 py-1 rounded-md text-center shadow-sm mt-2 w-max mx-auto">
                  {fileError}
                </p>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.name}
              </h1>
              <p className="text-gray-600">{profile.email}</p>
              <div className="mt-2">
                <RoleBadge role={profile.role} />
              </div>
            </div>
          </div>
         {activeTab=='profile'&&
          <div className="flex gap-2">
            {!isEditing  ? (
              <>
                <button
                onClick={handleEdit}
                disabled={isEditing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors
                            ${isEditing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
              </>
            ) : (
              <>
                <button
                  type='submit'
                  onClick={handleSave}
                   disabled={Object.values(errors).some((msg) => msg)}
                   className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white ${
                    Object.values(errors).some((msg) => msg)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
          </div>}
        </div>
      </div>
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
             <ProfileTabs
                icon={<User className="w-4 h-4" />}
                title="Profile Information"
                changeTab="profile"
                currentTab={activeTab}
                setTabs={handleTabs}
              />
              <ProfileTabs
                icon={<Lock className="w-4 h-4" />}
                title="security"
                changeTab="security"
                currentTab={activeTab}
                setTabs={handleTabs}
              />
            </nav>
          </div>
        </div>
     {activeTab=='profile'?(
      <form action="" onSubmit={(e)=>e.preventDefault()} >
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Name"
            value={profile.name}
            name='name'
            onChange={handleInputChange}
            disabled={!isEditing}
            required
            icon={<User className="w-4 h-4" />}
            
          />
          <InputField
            label="Phone"
            type='phone'
            name='phone'
            value={profile.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            error={errors.phone}
            icon={<Phone className="w-4 h-4" />}
          />
        </div>
        <div className="mt-4">
          <TextareaField
            label="Bio"
            value={profile.bio || ''}
            onChange={(value) => handleProfileUpdate('bio', value)}
            disabled={!isEditing}
            rows={4}
          />
        </div>
      </div>

      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)} Information
        </h2>
        <RoleSpecificFields
          profile={profile}
          isEditing={isEditing}
          // onUpdate={handleProfileUpdate}
        />
      </div>
      </form>):<PasswordChangeForm setTabs={handleTabs} userId={user!.id}/>}
    </div>
  );
  
};

export default ProfileManagement;