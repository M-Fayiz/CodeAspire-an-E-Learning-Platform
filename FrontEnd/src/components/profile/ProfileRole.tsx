import { Shield } from "lucide-react";
import type { IUserType } from "../../types/profile.type";

export const RoleSpecificFields: React.FC<{
  profile: IUserType;
  isEditing: boolean;
  // onUpdate: (field: keyof IUserType, value: any) => void;
}> = ({ profile, isEditing }) => {
 
 function handleChanges(e:React.ChangeEvent<HTMLInputElement>){
            const {name,value}=e.target
            console.log(name,value)
 } 
 

  if (profile.role === 'mentor') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Expertise Areas</label>
          <input
            type="text"
            name="expertise"
            value={profile.expertise?.join(', ') || ''}
            onChange={handleChanges}
            disabled={!isEditing}
            placeholder="e.g., JavaScript, React, Node.js"
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
          />
        </div>
        {profile.mentorRating && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Rating</label>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-yellow-500">{profile.mentorRating.toFixed(1)}</span>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.round(profile.mentorRating!) ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (profile.role === 'learner') {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Enrolled Courses</label>
          <div className="bg-gray-50 p-3 rounded-lg">
            {profile.enrolledCourses && profile.enrolledCourses.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.enrolledCourses.map((course, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {course}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No courses enrolled yet</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (profile.role === 'admin') {
    return (
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <Shield className="w-4 h-4 inline mr-1" />
            Administrator privileges active
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default  RoleSpecificFields