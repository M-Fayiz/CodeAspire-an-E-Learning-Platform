import { IRole } from "./user.types";

declare module "express-session" {
  interface SessionData {
    role?: IRole;
  }
}
