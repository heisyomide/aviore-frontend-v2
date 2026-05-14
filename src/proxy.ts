import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const session =
    request.cookies.get('session_id')?.value;

  const { pathname } = request.nextUrl;

  const protectedRoutes = [
    '/checkout',
    '/dashboard',
    '/vendor',
    '/admin',
    '/orders',
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // NOT LOGGED IN
  if (isProtected && !session) {
    return NextResponse.redirect(
      new URL('/login', request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/checkout/:path*',
    '/dashboard/:path*',
    '/vendor/:path*',
    '/admin/:path*',
    '/orders/:path*',
  ],
};