import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJwt } from 'jose'; 

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;
  const WAITING_ROOM_ROUTE = '/vendor/waiting-room';

  const protectedRoutes = ['/vendor', '/dashboard', '/admin'];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  // 1. RULE: NO TOKEN -> ENFORCE LOGIN
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. RULE: EVALUATE TOKEN ROLES & KYC SCOPES
  if (token) {
    try {
      const payload = decodeJwt(token) as { 
        role?: string; 
        kycStatus?: string; 
        kyc_status?: string;
        status?: string;
        isApproved?: boolean;
        is_approved?: boolean;
      };

      // Normalize role string safely
      const userRole = (payload?.role || '').toUpperCase();
      
      // Normalize any potential status strings safely
      const rawStatus = (payload?.kycStatus || payload?.kyc_status || payload?.status || '').toUpperCase();
      
      // Determine if they match any known positive approval indicator
      const isApprovedVendor = 
        rawStatus === 'APPROVED' || 
        rawStatus === 'ACTIVE' || 
        payload?.isApproved === true || 
        payload?.is_approved === true;

      if (userRole === 'VENDOR') {
        // 🚨 IMMUNIZATION FIX: If they are already marked approved, OR if your database status 
        // doesn't match standard keywords but they have items, DO NOT redirect them.
        // We only isolate them if the token explicitly flags them as newly registered 'PENDING' or 'NEW'.
        const isExplicitlyUnverified = rawStatus === 'PENDING' || rawStatus === 'NEW' || rawStatus === 'REJECTED';

        if (isExplicitlyUnverified && !isApprovedVendor) {
          if (pathname.startsWith('/vendor') && pathname !== WAITING_ROOM_ROUTE && !pathname.includes('submit-kyc-retry')) {
            console.warn(`[MIDDLEWARE RESTRICTION] Redirecting unverified onboarding candidate.`);
            return NextResponse.redirect(new URL(WAITING_ROOM_ROUTE, request.url));
          }
        }
      }
      
      // Prevent standard vendors or customers from cracking into /admin routes completely
      if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

    } catch (err) {
      console.error('Edge JWT analysis anomaly:', err);
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