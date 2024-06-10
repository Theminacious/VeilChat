require('dotenv').config();
import { resend } from "@/lib/resend";
import VerificationEmail from "../../Emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerficationEmail(
    email:string,
    username:string,
    verifyCode:string
): Promise<ApiResponse>{

    try {

        const response = await resend.emails.send({
            from:"onboarding@resend.dev",
            to: email,
            subject: "Verify your email address",
            react: VerificationEmail({username,otp:verifyCode}),
            text: "Hello, Welcome to VeilChat. Please verify your email address by using the following code: " + verifyCode
        })

        return {success:true,message:"Verification email sent"}
        
    } catch (emailError) {
        console.log("Error sending verification email",emailError)
        return {success:false,message:"Error sending verification email"}
        
    }

}

