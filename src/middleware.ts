import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 🌟 TIP: If your token is a standard JWT, you can import 'decodeJwt' from 'jose' 
// to inspect payload fields directly at the Edge without slowing down execution speeds.
import { decodeJwt } from 'jose'; 

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  // Define the explicit bypass route for the waiting room to avoid infinite redirect loops
  const WAITING_ROOM_ROUTE = '/vendor/waiting-room';

  // ✅ PROTECTED BASE PATHS
  const protectedRoutes = [
    '/vendor',
    '/dashboard',
    '/admin',
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 1. RULE: NO TOKEN -> ENFORCE LOGIN
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. RULE: EVALUATE TOKEN ROLES & KYC SCOPES AT THE SERVER LEVEL
  if (token) {
    try {
      // Decode the JWT structure on the fly at the Edge firewall layer
      const payload = decodeJwt(token) as { role?: string; kycStatus?: string };

      // Check if the user is a vendor who has NOT been approved yet
      if (payload?.role === 'VENDOR' && payload?.kycStatus !== 'APPROVED') {
        
        // Allow them to visit the waiting room or a retry submission page, block everything else under /vendor
        if (pathname.startsWith('/vendor') && pathname !== WAITING_ROOM_ROUTE && !pathname.includes('submit-kyc-retry')) {
          console.warn(`[MIDDLEWARE BLOCK] Redirecting unverified Vendor to secure sandbox cage.`);
          return NextResponse.redirect(new URL(WAITING_ROOM_ROUTE, request.url));
        }
      }
      
      // Prevent standard vendors or customers from cracking into /admin routes completely
      if (pathname.startsWith('/admin') && payload?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

    } catch (err) {
      console.error('Edge JWT analysis anomaly:', err);
      // If the token cookie is corrupted or tampered with, wipe it and clear access
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
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