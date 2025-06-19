import transport from "../config/email.config";
import {env} from '../config/env.config'


 export const sendToken =async(email:string,token:string)=>{

    const verifyUrl = `${env.CLIENT_ORGIN}/auth/verify-email?token=${token}&email=${email}`;
    try{
      const option = {
            from: '',
            to: email,
            subject: 'WarmUp Sync OTP Verification',
            html: `
                <h1>Email Verification</h1>
                <p>Click the button to verify your email:</p>
                <a href="${verifyUrl}" style="padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
                <p>Use this link to verify your email. Do not share it with anyone.</p><br />
                <p>If you did not request this verification, you can ignore this email.</p>
                <p>— WarmUp Team</p>
            `,
            };

        await transport.sendMail(option)
    }catch(error){
      console.log(error)
    }
}