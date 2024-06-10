import { Message } from "@/model/user.models";

export interface ApiResponse{
    success:boolean;
    message:string;
    isAcceptingMessages?:boolean
    messages?:Array<Message>
}

export default ApiResponse