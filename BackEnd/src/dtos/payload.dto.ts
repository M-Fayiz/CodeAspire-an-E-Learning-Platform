import { IPayloadDTO } from "../types/dto.types";
import { IAnyUser } from "../types/user.types";


export function payloadDTO(user:IAnyUser):IPayloadDTO{
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