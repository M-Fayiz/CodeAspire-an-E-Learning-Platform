import { IUserRole } from "./user.types";

declare module "express-session" {
  interface SessionData {
    role?: IUserRole;
  }
}
