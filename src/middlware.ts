import { getToken } from 'next-auth/jwt'
import { NextRequest,NextResponse } from 'next/server'
export {default} from 'next-auth/middleware'

 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token  = await getToken({req:request})
    const url = request.nextUrl

    if(token &&(
        url.pathname.startsWith('/sign-in') 
        || url.pathname.startsWith('/sign-up')
        || url.pathname.startsWith('/verify')
        || url.pathname.startsWith('/')
    )){
        return NextResponse.redirect(new URL('/dashboard', request.url))
        
    }

 if (!token && url.pathname.startsWith('/dashboard')) {

    return NextResponse.redirect(new URL('/sign-in', request.url))
  
 }
 return NextResponse.next();
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify:path*'
  ]
}