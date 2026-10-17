import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth'
import { headers } from 'next/headers'

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    //if not authenticated, match all paths except '/' and '/sign-in', and '/home' and '/tweets/[id]' and '/users/[handle]'
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if(!session){
        return NextResponse.redirect(new URL('/home', request.url))
    }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|home|tweets|users|sign-in).*)',
  ],
}