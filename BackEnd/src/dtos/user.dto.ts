import { IUserDTO } from "../types/dto.types";
import { IAnyUser } from "../types/user.types";


export function userDTO(user:IAnyUser):IUserDTO{
    return{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
        profile:user.profilePicture,
        ApprovalStatus:user.ApprovalStatus,
        isRequested:user.isRequested
    }
}

