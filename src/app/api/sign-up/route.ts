import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.models";
import bcrypt from "bcryptjs";
import { sendVerficationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {

    await dbConnect();

    try {

        const {username,email,password} = await request.json();

       const existingUserVerifiedByUsername =  await UserModel.findOne({
            username,
            isVerified:true
        })

        if(await existingUserVerifiedByUsername){

            return Response.json({
                    success: false,
                    message: "Username already exists"
               },{
                   status: 400
               }
            )
        }

        const existingUserByEmail =  await UserModel.findOne({
            email,
            isVerified:true
        })

        const verifyCode = Math.floor(100000+Math.random()*900000).toString()

        if(existingUserByEmail){
            if (existingUserByEmail.isVerified) {

                return Response.json({
                    success: false,
                    message: "Email already exists"
               },{status: 500}
            )

            }else{

                const hashedPassword = await bcrypt.hash(password,10)
                existingUserByEmail.password= hashedPassword;
                existingUserByEmail.verifyCode=verifyCode;
                existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000);
                existingUserByEmail.save();
                
            }

            
        }else{
            const hashedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()

            expiryDate.setDate(expiryDate.getDate() + 1)

            const newUser = await UserModel.create({
                username,
                email,
                password: hashedPassword,
                messages:[],
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true
            })
            await newUser.save()
        }

        //Send verification email

        const emailResponse = await sendVerficationEmail(email,username,verifyCode)

        if(!emailResponse.success){

            return Response.json({
                success: false,
                message: "Error sending verification email"
            },{status:500})
        }

        return Response.json({
            success:true,
            message: "User registered successfully . Please Verify Your email"

        },{status:201})
        
    } catch (error) {
        console.log("Error registering user",error)

        return Response.json(
            {
                success: false,
                message: "Error registering user"

            }
        )
    }
}