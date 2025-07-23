import { ILearnerModel, IMenterModel } from "../models/user.model";
import { ILearnerDTO, IMentorDTO } from "../types/dto.types";

export function MentorDTO(mentor:IMenterModel):IMentorDTO{
   
    return{
        id:mentor._id,
        name:mentor.name,
        email:mentor.email,
        role:mentor.role,
        phone:mentor.phone,
        profilePicture:mentor.profilePicture,
        isActive:mentor.isActive,
        expertise:mentor.expertise,
        bio:mentor.bio,
        socialLinks:mentor.socialLinks,
        mentorRating:mentor.mentorRating,
        resume:mentor.resume,
        isApproved:mentor.isApproved,
        isRequested:mentor.isRequested
    }
}

export function LearnerDTO(learner:ILearnerModel):ILearnerDTO{
    return{
        id:learner._id,
        name:learner.name,
        email:learner.email,
        role:learner.role,
        phone:learner.phone,
        profilePicture:learner.profilePicture,
        isActive:learner.isActive,
        bio:learner.bio,
        enrolledCourses:learner.enrolledCourses
    }
}


