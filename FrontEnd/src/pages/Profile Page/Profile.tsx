import React, { useEffect, useState } from "react";
import { User, Phone, Save, Edit2, Lock, Camera, FilePlus } from "lucide-react";
// import ProfileImage from '../../components/profile/ProfileImage';
import { PasswordChangeForm } from "../../components/profile/ChangePassword";
import { useAuth } from "../../context/auth.context";
import { ProfileTabs } from "../../components/profile/ProfileUI/Profile-Taps";
export type TapsComp = "profile" | "security" | "additional";
import RoleBadge from "../../components/profile/ProfileUI/RoleBadge";
import UserService from "../../service/user.service";
import { validateFiles } from "../../schema/auth.schema";
import { Input } from "@/components/ui/Inputs";
import type { AnyUser, MentorUser } from "@/types/users.type";
import AdditionalInformation from "@/components/profile/AdditionalInfo";
import { sharedService } from "@/service/shared.service";
import { useParams } from "react-router";
import { toast } from "sonner";
import { ApiError } from "@/utility/apiError.util";

const ProfileManagement: React.FC = () => {
  const [updatedFields, setUpdatedFields] = useState<Partial<AnyUser>>({});
  const [profile, setProfile] = useState<AnyUser | null>(null);
  const [isPictureUpdate, setIsPictureUpdate] = useState(false);

  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [originalProfile, setOriginalProfile] = useState<AnyUser | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [fileError, setFileError] = useState("");
  const [activeTab, setActiveTab] = useState<TapsComp>("profile");
  const [signedImageUrl, setSignedImageUrl] = useState<string>("");

  const handleEdit = () => {
    if (!profile) {
      return (
        <div className="p-6 text-center text-gray-500">Loading profile...</div>
      );
    }

    setOriginalProfile({ ...profile });
    setIsEditing(true);
  };
  const { id } = useParams();

  useEffect(() => {
    async function fetchUserData() {
      if (!user?.id) return;
      try {
        const result = await UserService.fetchProfile(id as string);
        if (result) {
          if (result.profilePicture) {
            const get_fileURL = await sharedService.getPreSignedDownloadURL(
              result.profilePicture,
            );
            setSignedImageUrl(get_fileURL);
          }
          setProfile(result);
          setOriginalProfile(result);
        }
      } catch (error) {
        if (error instanceof ApiError) toast.error(error.message);
      }
    }
    fetchUserData();
  }, [isPictureUpdate, id, user]);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsEditing(false);
    e.preventDefault();
    
    try {
      const result = await UserService.updateProfile(user!.id, updatedFields);
      console.log('profile :',result)
      if (result) {
        setProfile(result.updatedData)
        toast.success("Profile updated Successfully");
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  const handleChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;

    setProfile((prev) => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });

    setUpdatedFields((prv) => ({
      ...prv,
      [name]: value,
    }));

    const errorMessage = value.trim() === "" ? "This field is required" : "";

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  const handleTabs = (tab: TapsComp) => {
    setActiveTab(tab);
  };

  const handleProfilePictureUpdate = async (file: File) => {
    try {
      const result = await sharedService.getS3BucketUploadUrl(file);
      const fileURL = await UserService.uploadImageIntoS3(
        result.uploadURL,
        result.fileURL,
        file,
        user!.id,
      );

      if (fileURL) {
        setIsPictureUpdate(true);
      }
      console.log(profile);
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(error.message);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPictureUpdate(false);
    const file = e.target.files?.[0];
    if (file) {
      const validatedError = validateFiles(file.type, "image");
      if (validatedError) {
        setFileError(validatedError);
        return;
      }
      setFileError("");
      handleProfilePictureUpdate(file);
    }
  };

  if (!profile) return;

  return (
    <div className="max-w-4xl mx-auto p-5 space-y-2">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className=" relative flex flex-col items-center">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shadow-md">
                {profile && profile.profilePicture ? (
                  <img
                    src={signedImageUrl}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-1/2 h-1/2 text-gray-400" />
                )}
                <label className="absolute bottom-0 right-2 bg-orange-500 p-1 rounded-full cursor-pointer hover:bg-orange-600 transition duration-200 shadow-md">
                  <Camera className="w-4 h-4 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {fileError && (
                <p className="text-[11px] text-red-500 absolute top-23 left-0 bg-red-100 px-3 py-1 rounded-md text-center shadow-sm mt-2 w-max mx-auto">
                  {fileError}
                </p>
              )}
            </div>
            {profile && (
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile.name}
                </h1>
                <p className="text-gray-600">{profile.email}</p>
                <div className="mt-2">
                  <RoleBadge role={profile.role} />
                </div>
              </div>
            )}
          </div>
          {activeTab == "profile" && (
            <div className="flex gap-2">
              {!isEditing && (
                <>
                  <button
                    onClick={handleEdit}
                    disabled={isEditing}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors
                            ${isEditing ? "bg-gray-400 cursor-not-allowed" : "bg-gray-600 hover:bg-gray-700"}`}
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          )}
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
            {profile.role == "mentor" && (
              <ProfileTabs
                icon={<FilePlus className="w-4 h-4" />}
                title="Additional Information"
                changeTab="additional"
                currentTab={activeTab}
                setTabs={handleTabs}
              />
            )}
          </nav>
        </div>
      </div>
      {activeTab == "profile" ? (
        <form action="" onSubmit={handleSave}>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Name"
                value={profile.name}
                name="name"
                onChange={handleChange}
                type="text"
                disabled={!isEditing}
                icon={<User className="w-4 h-4" />}
              />
              <Input
                label="Phone"
                value={profile.phone}
                name="phone"
                onChange={handleChange}
                type="phone"
                disabled={!isEditing}
                icon={<Phone className="w-4 h-4" />}
              />
            </div>
            <div className="mt-4">
              <Input
                label="Bio"
                value={profile.bio || ""}
                type="text"
                onChange={handleChange}
                name="bio"
                textArea
                disabled={!isEditing}
              />
            </div>
            {isEditing && (
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={Object.values(errors).some((msg) => msg)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white ${
                    Object.values(errors).some((msg) => msg)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gray-900 hover:bg-gray-800"
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
              </div>
            )}
          </div>
        </form>
      ) : activeTab === "additional" ? (
        <AdditionalInformation MentorData={profile as MentorUser} />
      ) : (
        <PasswordChangeForm setTabs={handleTabs} userId={user!.id} />
      )}
    </div>
  );
};

export default ProfileManagement;
