import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Extract the session ID from cookies
  const session = request.cookies.get('session_id')?.value;
  const { pathname } = request.nextUrl;

  // 2. Define Protected and Auth routes
  const protectedRoutes = ['/checkout', '/dashboard', '/vendor', '/admin', '/orders'];
  const authRoutes = ['/login', '/register'];

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname === route);

  // LOGIC A: Unauthenticated user trying to access protected content
  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/login', request.url);
    // Attach the intended destination so we can return after login
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // LOGIC B: Authenticated user trying to access login/register
  if (isAuthRoute && session) {
    // Determine redirect based on stored role if possible, or default to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// 3. Optimized Matcher Configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, logos, etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)',
  ],
};