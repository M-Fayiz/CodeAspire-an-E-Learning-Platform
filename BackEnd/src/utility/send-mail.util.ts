import transport from "../config/email.config";
import { env } from "../config/env.config";

export const sendToken = async (
  email: string,
  token: string,
  endPoint: string,
) => {
  const verifyUrl = `${env.CLIENT_ORGIN}/auth/${endPoint}?token=${token}&email=${email}`;
  try {
    const option = {
      from: "",
      to: email,
      subject: "Tech master Sync OTP Verification",
      html: `
                <h1>Email Verification</h1>
                <p>Click the button to verify your email:</p>
                <a href="${verifyUrl}" style="padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
                <p>Use this link to verify your email. Do not share it with anyone.</p><br />
                <p>If you did not request this verification, you can ignore this email.</p>
                <p>— WarmUp Team</p>
            `,
    };

    await transport.sendMail(option);
  } catch (error) {
    console.log(error);
  }
};
export const sendMail = async (
  email: string,
  title: string,
  message: string,
) => {
  try {
    const option = {
      from: "",
      to: email,
      subject: "",
      html: `
                <h1>${title}</h1>
                <p>${message}.</p><br />
                <p>.</p>
                <p>— TechMaster Team</p>
            `,
    };

    await transport.sendMail(option);
  } catch (error) {
    console.log(error);
  }
};
