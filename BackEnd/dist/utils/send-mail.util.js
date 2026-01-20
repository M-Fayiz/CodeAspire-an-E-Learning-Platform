"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = exports.sendToken = void 0;
const email_config_1 = __importDefault(require("../config/email.config"));
const env_config_1 = require("../config/env.config");
const sendToken = async (email, token, endPoint) => {
    const verifyUrl = `${env_config_1.env.CLIENT_URL_2}/auth/${endPoint}?token=${token}&email=${email}`;
    try {
        const option = {
            from: "",
            to: email,
            subject: "CodeAspire Sync OTP Verification",
            html: ` 
                <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
  </head>
  <body
    style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: Arial, sans-serif;"
  >
    <table
      align="center"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);"
    >
      <tr>
        <td style="padding: 30px 40px; text-align: center;">
          <h1 style="color: #222; font-size: 24px; margin-bottom: 20px;">
            Verify Your Email Address
          </h1>
          <p style="color: #555; font-size: 16px; margin-bottom: 30px;">
            Thank you for signing up with <strong>CodeAspire</strong>! Please
            confirm your email address by clicking the button below.
          </p>

          <a
            href="${verifyUrl}"
            style="display: inline-block; padding: 12px 28px; background-color: #007bff; color: #ffffff; text-decoration: none; font-size: 16px; border-radius: 6px; font-weight: bold;"
          >
            Verify Email
          </a>

          <p
            style="color: #777; font-size: 14px; margin-top: 25px; line-height: 1.6;"
          >
            This link will verify your email address. Please do not share it
            with anyone for your security.
          </p>

          <p style="color: #999; font-size: 14px; margin-top: 25px;">
            If you did not request this verification, please ignore this email.
          </p>

          <hr
            style="border: none; height: 1px; background-color: #eee; margin: 30px 0;"
          />

          <p style="color: #444; font-size: 14px; margin-bottom: 0;">
            Best regards,<br />
            <strong>CodeAspire Team</strong>
          </p>

          <p style="color: #aaa; font-size: 12px; margin-top: 8px;">
            © 2025 CodeAspire. All rights reserved.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>

            `,
        };
        await email_config_1.default.sendMail(option);
    }
    catch (error) {
        console.log(error);
    }
};
exports.sendToken = sendToken;
const sendMail = async (email, title, message) => {
    try {
        const option = {
            from: "",
            to: email,
            subject: "",
            html: `
                <h1>${title}</h1>
                <p>${message}.</p><br />
                <p>.</p>
                <p>— CodeAspire Team</p>
            `,
        };
        await email_config_1.default.sendMail(option);
    }
    catch (error) {
        console.log(error);
    }
};
exports.sendMail = sendMail;
