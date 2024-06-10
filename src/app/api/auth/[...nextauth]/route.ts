import nextAuth from "next-auth";
import { authOptions } from "./options";

const Handler = nextAuth(authOptions)

export { Handler as GET, Handler as POST }