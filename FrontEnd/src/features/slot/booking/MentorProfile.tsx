import { CardHeader, CardTitle } from "@/components/ui/card"
import type { IMentorDTO } from "@/types/DTOS/user.dto"
import { Star } from "lucide-react"
interface MentorProfileProps{
    mentor:IMentorDTO
}

const MentorSlotProfile:React.FC<MentorProfileProps>=({mentor})=>{
    return(
        <>
        <CardHeader className="flex flex-col md:flex-row items-center gap-6 p-6 border-b border-gray-100 bg-gradient-to-r from-gray-100 to-white">
          <img
            src={mentor.profilePicture}
            alt="mentor"
            className="w-35 h-35 rounded-full object-cover border-4 border-orange-400 shadow-sm"
          />
          <div className="flex flex-col gap-2 text-center md:text-left">
            <CardTitle className="text-2xl font-semibold text-gray-800">{mentor.name}</CardTitle>
            <p className="text-gray-600 text-sm font-medium">Full Stack Developer & Mentor</p>
            <p className="text-gray-500 text-sm max-w-2xl leading-relaxed">{mentor.bio}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {mentor.expertise&&mentor.expertise.map((skill, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-lg"
                >
                  {skill}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-yellow-500 mt-2">
              <Star size={18} fill="currentColor" />
              {/* <span className="text-gray-700 text-sm font-medium">{mentor.rating} / 5.0</span> */}
            </div>
          </div>
        </CardHeader>
        </>
    )
}

export default MentorSlotProfile