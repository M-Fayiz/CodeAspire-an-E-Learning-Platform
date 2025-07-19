
import { searchProps } from "../types/user.types";
import { IAnyUser} from "../types/user.types";
import { FilterQuery } from "mongoose";

export const buildUserFilter = (query: searchProps): FilterQuery<IAnyUser> => {
  const filter: FilterQuery<IAnyUser> = {
    role: { $ne: 'admin' },
  };

  if (query.name) {
    filter.name = { $regex: query.name, $options: 'i' };
  }
  if (query.role) {
    filter.role = query.role;
  }
  if (typeof query.isActive === 'boolean') {
    filter.isActive = query.isActive;
  }

  return filter;
};
