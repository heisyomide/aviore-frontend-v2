import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session_id')?.value;
  const { pathname } = request.nextUrl;

  // 1. Define Protected Paths
  const protectedRoutes = ['/checkout', '/dashboard', '/vendor', '/admin', '/orders'];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  // 2. LOGIC: If trying to access protected content WITHOUT a session
  if (isProtected && !session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname); 
    return NextResponse.redirect(loginUrl);
  }

  // 3. LOGIC: If ALREADY logged in, don't allow /login or /register
  if (session && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// 4. CRITICAL: The Matcher must exclude static assets to prevent infinite loops
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};