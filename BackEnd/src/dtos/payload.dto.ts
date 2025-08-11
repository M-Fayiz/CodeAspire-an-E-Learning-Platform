import { IPayloadDTO } from "../types/dtos.type/dto.types";
import { IAnyUser } from "../types/user.types";

export const payloadDTO = (user: IAnyUser): IPayloadDTO => {
  return {
    _id: user._id,
    email: user.email,
    role: user.role,
  };
};
