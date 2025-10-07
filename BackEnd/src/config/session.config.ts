import { env } from "./env.config";

const secrete = env.SESSION_SECRET as string;
export const sessionConfig = {
  secret: secrete,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
};
