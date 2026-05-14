import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session_id')?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/checkout', '/dashboard', '/vendor', '/admin', '/orders'];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  // 1. If trying to access protected content WITHOUT a session
  if (isProtected && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname); // Helpful for post-login redirect
    return NextResponse.redirect(loginUrl);
  }

  // 2. If ALREADY logged in, don't let them go back to login/register
  if (session && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static, _next/image (Next.js assets)
     * - favicon.ico, public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};