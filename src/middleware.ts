import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session_id')?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = ['/checkout', '/dashboard', '/vendor', '/admin', '/orders'];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  // 1. If no session, kick to login
  if (isProtected && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname); 
    return NextResponse.redirect(loginUrl);
  }

  // 2. If logged in, don't allow /login
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};