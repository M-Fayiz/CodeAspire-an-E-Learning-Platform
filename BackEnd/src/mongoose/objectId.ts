import { Types } from "mongoose";

export const parseObjectId = (id: string): Types.ObjectId | null => {
  if (!Types.ObjectId.isValid(id)) return null;
  return new Types.ObjectId(id);
};
