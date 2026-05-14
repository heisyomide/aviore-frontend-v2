import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {

  const token = request.cookies.get('token')?.value;

  const pathname = request.nextUrl.pathname;

  // ✅ PROTECTED ROUTES
  const protectedRoutes = [
    '/vendor',
    '/dashboard',
    '/admin',
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // ✅ NO TOKEN
  if (isProtected && !token) {

    const loginUrl = new URL('/login', request.url);

    loginUrl.searchParams.set('from', pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/vendor/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
  ],
};