import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/user.models";
import { getServerSession } from "next-auth";
import {User} from 'next-auth'

export async function POST(request:Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user:User =  session?.user as User

    if(!session || !session.user){

        return Response.json(
            {
                success: false,
                message: "Unauthorized"
            },
            {
                status: 401
            }
        )
    }
    const userId = user._id;
    const {acceptMessage} = await request.json()

    try {

        const updatedUser = await UserModel.findByIdAndUpdate(userId,
            {
                isAcceptingMessage : acceptMessage,
            },
            {new:true}
        )
        if(!updatedUser){

            return Response.json(
                {
                    success: false,
                    message: "Failed to upadate user status to accept messages"
                },
                {status:401}  
                ) 
        }

        return Response.json(
            {
                success: true,
                message: "Successfully updated user status to accept messages",
                updatedUser

            },
            {status: 200}
        )




        
        
    } catch (error) {

        console.log("Failed to upadate user status to accept messages")
        return Response.json(
            {
                success: false,
                message: "Failed to upadate user status to accept messages"
            }
            ,
            {status: 500}
        )
        

    }
}

export async function GET(request:Request){

    await dbConnect()

    const session = await getServerSession(authOptions)
    const user:User =  session?.user as User

    if(!session || !session.user){

        return Response.json(
            {
                success: false,
                message: "Unauthorized"
            },
            {
                status: 401
            }
        )
    }


    const userId = user._id;
   try {
     const foundUser = await UserModel.findById(userId)
 
     if(!foundUser){
 
         return Response.json(
             {
                 success: false,
                 message: "User not found"
             },
             {status: 404}
         )
     }
 
     return Response.json(
         {
             success: true,
            isAcceptingMessage:foundUser.isAcceptingMessage
         },
         {status: 200}
     )
 
   } catch (error) {

       console.log("Failed to update  user status to accept messages")

       return Response.json(
           {
               success: false,
               message: "Error in getting message acceptance status"
           },
           {status: 500}
       )
    
   }
}