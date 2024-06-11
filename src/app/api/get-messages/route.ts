import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/user.models";
import { getServerSession } from "next-auth";
import {User} from 'next-auth'
import mongoose from "mongoose";



export async function Get(request:Request){


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

    const userId = new mongoose.Types.ObjectId(user._id)
    try {

        const user = await UserModel.aggregate([
            {
                $match:{
                    _id:userId
                }
            },
            {
                $unwind:{
                    path:"$messages"
                }
            },
            {
                $sort:{
                    "messages.createdAt":-1
                }
            },
            {
                $group:{
                    _id:"$_id",
                    messages:{$push:"$messages"}
                }
            }
        ])    
        
        if(!user || user.length===0){

            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }

        return Response.json(
            {
                success: true,
                messages:user[0].messages
            },
            {
                status: 200
            }
            
        )

    } catch (error) {

        console.log("UnExpected Error occured",error)

        return Response.json(
            {
                success: false,
                message: "NOT AUTHENTICATED"
            },
            {
                status: 500
            }
            
        )
        
    }
}