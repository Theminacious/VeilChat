import mongoose,{Schema,Document} from "mongoose";


export interface Message extends Document{
    content:string;
    createdAt:Date
}

export interface User extends Document{
    username:string;
    email:string;
    password:string;
    messages:Message[];
    verifyCode:string;
    verifyCodeExpiry: Date;
    isVerified:boolean,
    isAcceptingMessage:boolean;
}

const messageSchema: Schema<Message> = new Schema({
    content:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        required:true,

    }
})

const userSchema:Schema<User> = new Schema({

    username:{
        type:String,
        required:[true,"Username is required"],
        trim:true,
        unique:true,
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true,
        match:[/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/,"Please use a valid email address"]
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    messages:[messageSchema],
    verifyCode:{
        type:String,
        required:[true,"Verify code is required"]
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"Verify code expiry is required"]
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
     
    isVerified:{
        type:Boolean,
        default:false

    }


})

const UserModel =(mongoose.models.User as mongoose.Model<User>) ||  mongoose.model<User>("User",userSchema)

export  default UserModel