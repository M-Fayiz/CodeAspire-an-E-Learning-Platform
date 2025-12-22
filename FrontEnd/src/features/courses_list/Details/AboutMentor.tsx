import { useAuth } from "@/context/auth.context";
import { ChatService } from "@/service/chat.service";
import UserService from "@/service/user.service";
import type { MentorDTO } from "@/types/DTOS/SharedCourseDetails";
import { MessageSquare } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

interface MentorProps {
  mentorId: string;
  courseId: string;
  enrolledId:string|null
}

const MentorProfile: React.FC<MentorProps> = ({ mentorId, courseId ,enrolledId}) => {
  const [mentorProfile, setMentorProfile] = useState<MentorDTO>({
    name: "",
    bio: "",
    experience: 0,
    expertise: [],
    socialLinks: {
      github: "",
      linkedIn: "",
      portfolio: "",
    },
    profilePicture: "",
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const data = await UserService.getUserProfile(mentorId);

      if (data) {
        setMentorProfile(data);
      }
    })();
  }, [mentorId]);

  const createChatRoom = async () => {
    try {
      const data = await ChatService.createChat(user!.id, mentorId);
      if (data) {
        navigate(`/${user?.role}/chats`);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };
  return (
    <section className="bg-white py-12 px-6 md:px-12 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-xl font-semibold text-black mb-10 text-center md:text-left">
        About Me
      </h2>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
        <div className="relative flex-shrink-0">
          <img
            src={mentorProfile.profilePicture}
            alt={mentorProfile.name}
            className="w-56 h-56 object-cover rounded-xl shadow-lg border-4 border-orange-100 hover:scale-105 transition-transform duration-300"
          />
          {/* <span className="absolute bottom-2 right-2 bg-orange-500 text-white text-xs px-3 py-1 rounded-full shadow">
        Mentor
      </span> */}
        </div>

        <div className="flex-1 text-center md:text-left">
          <h3 className="text-3xl font-bold text-gray-800 mb-2">
            {mentorProfile.name}
          </h3>

          <p className="text-gray-500 text-base leading-relaxed mb-6">
            {mentorProfile.bio}
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
            {mentorProfile.socialLinks.github && (
              <a
                href={mentorProfile.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
              >
                <i className="ri-github-fill text-xl"></i> GitHub
              </a>
            )}
            {mentorProfile.socialLinks.linkedIn && (
              <a
                href={mentorProfile.socialLinks.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
              >
                <i className="ri-linkedin-box-fill text-xl"></i> LinkedIn
              </a>
            )}
            {mentorProfile.socialLinks.portfolio && (
              <a
                href={mentorProfile.socialLinks.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
              >
                <i className="ri-global-line text-xl"></i> Portfolio
              </a>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={createChatRoom}
              className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <MessageSquare className={`text-white w-4 h-4 hidden md:block`} />{" "}
              Chat with Mentor
            </button>
            {enrolledId&&user?.role !== "admin" && (
              <Link
                to={`/learner/slot-booking/${courseId}`}
                className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <MessageSquare
                  className={`text-white w-4 h-4 hidden md:block`}
                />{" "}
                Book Slot With mentor
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MentorProfile;
