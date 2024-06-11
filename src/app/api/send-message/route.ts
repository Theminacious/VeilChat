import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.models";
import { Message } from "@/model/user.models";


export async function POST(request:Request) {

    await dbConnect();
  const {username,content}=  await request.json()
  try {

    const user = await UserModel.findOne({username})

    if(!user){

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

    /// is user accepting the messages
    if(!user.isAcceptingMessage){

        return Response.json(
            {
                success: false,
                message: "User is not accepting messages"
            },
            {
                status: 403
            }
        )
    }

    const newMessage =  {content,createdAt: new Date()
    }

    user.messages.push(newMessage as Message)

    await user.save()

    return Response.json(
        {
            success: true, 
            message: "message sent successfuly"
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
            message: "Something went wrong"
        },
        {
            status: 500
        }
    )
    
  }

}

