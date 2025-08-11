export const options = {
  httpOnly: true,
  secure: true,
  sameSite:
    process.env.NODE_ENV === "production"
      ? ("none" as const)
      : ("lax" as const),
  domain: undefined,
  path: "/",
};
