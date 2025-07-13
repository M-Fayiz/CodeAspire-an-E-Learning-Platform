
import { searchProps } from "../types/user.types";

export const buildUserFilter = (query: searchProps): Record<string, any> => {
  const filter: Record<string, any> = {
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
