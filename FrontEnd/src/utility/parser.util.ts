import type { SearchQuery } from "../types/parser.types";

export const searchFromParser = (form: SearchQuery) => ({
  name: form.name.trim(),
  role: form.role,
  isActive:
    form.isActive === "true" ? true : form.isActive === "false" ? false : "",
});
