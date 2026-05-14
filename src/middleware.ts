import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // =========================================
  // PUBLIC ROUTES
  // =========================================
  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
  ];

  // =========================================
  // SKIP NEXT INTERNALS + STATIC FILES
  // =========================================
  const isStaticFile =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/assets');

  if (isStaticFile) {
    return NextResponse.next();
  }

  // =========================================
  // SESSION COOKIE
  // =========================================
  const sessionId = request.cookies.get('session_id')?.value;

  // =========================================
  // IF USER IS NOT AUTHENTICATED
  // =========================================
  const isPublic = publicRoutes.includes(pathname);

  if (!sessionId && !isPublic) {
    const loginUrl = new URL('/login', request.url);

    // Save intended route
    loginUrl.searchParams.set('from', pathname);

    return NextResponse.redirect(loginUrl);
  }

  // =========================================
  // IF USER IS AUTHENTICATED
  // PREVENT ACCESS TO LOGIN/REGISTER
  // =========================================
  if (sessionId && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // =========================================
  // ALLOW REQUEST
  // =========================================
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Protect everything except:
     * - api
     * - next internals
     * - static files
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};