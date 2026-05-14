// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 🛡️ THE GATEKEEPER
 * Using 'export function middleware' is the standard convention.
 */
export function proxy(request: NextRequest) {
  const session = request.cookies.get('session_id')?.value;
  const { pathname } = request.nextUrl;

  // Define your protected registry zones
  const protectedRoutes = ['/checkout', '/dashboard', '/orders'];

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!session) {
      const url = new URL('/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

/**
 * 🏛️ MATCHER CONFIG
 * This tells Next.js exactly which paths to trigger the function for.
 */
export const config = {
  matcher: [
    '/checkout/:path*',
    '/dashboard/:path*',
    '/orders/:path*',
  ],
};