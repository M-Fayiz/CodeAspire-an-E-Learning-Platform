import UserService from "@/service/client-API/user.service";
import type { MentorDTO } from "@/types/DTOS/SharedCourseDetails";
import React, { useEffect, useState } from "react";

interface MentorProps {
  id: string;
}

const MentorProfile: React.FC<MentorProps> = ({ id }) => {
  const [mentorProfile, setMentorProfile] = useState<MentorDTO>({
    name: "",
    bio: "",
    experience: "",
    expertise: [],
    socialLinks: {
      github: "",
      linkedIn: "",
      portfolio: "",
    },
    profilePicture: "",
  });

  useEffect(() => {
    (async () => {
      const data = await UserService.getUserProfile(id);

      if (data) {
        setMentorProfile(data);
      }
    })();
  }, [id]);
  console.log(" mentotr data ", mentorProfile);
  return (
    <section className="bg-white py-12 px-6 md:px-12 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold text-green-600 mb-8">About Me</h2>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
        <div className="flex-shrink-0">
          <img
            src={mentorProfile.profilePicture}
            alt={mentorProfile.name}
            className="w-60 h-60 object-cover rounded-lg shadow-md"
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-bold text-gray-800">
            {mentorProfile.name}
          </h3>
          {/* {role && <p className="text-green-600 font-medium mb-4">{role}</p>} */}
          <p className="text-gray-600 leading-relaxed mb-6">
            {mentorProfile.bio}
          </p>

          <div className="flex justify-center md:justify-start gap-12 mb-6">
            {mentorProfile.expertise.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-bold text-green-600">{stat}</p>
              </div>
            ))}
          </div>

          {mentorProfile.socialLinks.github && (
            <a
              href={mentorProfile.socialLinks.github}
              className="text-green-600 font-semibold hover:underline inline-flex items-center gap-2"
            >
              Github
            </a>
          )}
          {mentorProfile.socialLinks.linkedIn && (
            <a
              href={mentorProfile.socialLinks.linkedIn}
              className="text-green-600 font-semibold hover:underline inline-flex items-center gap-2"
            >
              Github
            </a>
          )}
          {mentorProfile.socialLinks.portfolio && (
            <a
              href={mentorProfile.socialLinks.portfolio}
              className="text-green-600 font-semibold hover:underline inline-flex items-center gap-2"
            >
              Github
            </a>
          )}
        </div>
      </div>
    </section>
  );
};

export default MentorProfile;
