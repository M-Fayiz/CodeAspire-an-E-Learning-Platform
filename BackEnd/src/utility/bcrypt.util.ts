import bcrypt from "bcrypt";

export const hashPassword = async (pass: string) => {
  const salt = 10;
  return await bcrypt.hash(pass, salt);
};

export async function comparePassword(
  pass: string,
  hashed: string,
): Promise<boolean> {
  return await bcrypt.compare(pass, hashed);
}
