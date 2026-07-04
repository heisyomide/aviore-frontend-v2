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

      const userRole = payload?.role?.toUpperCase();
      
      // Extract status using multiple common keys as fallbacks
      const rawStatus = payload?.kycStatus || payload?.kyc_status || payload?.status || '';
      const currentKycStatus = rawStatus.toUpperCase();
      
      // Fallback flag check: If your system sets a boolean like isApproved: true
      const isExplicitlyApproved = payload?.isApproved === true || payload?.is_approved === true || currentKycStatus === 'ACTIVE';

      // 🚨 CRITICAL FIX: If they are a VENDOR, they only get sent to the waiting room 
      // if we are ABSOLUTELY certain their status is explicitly 'PENDING', 'REJECTED', or unverified.
      // If they are already active with products, this ensures they pass right through.
      if (userRole === 'VENDOR') {
        const isUnverified = currentKycStatus === 'PENDING' || currentKycStatus === 'REJECTED' || (!currentKycStatus && !isExplicitlyApproved);
        
        if (isUnverified) {
          if (pathname.startsWith('/vendor') && pathname !== WAITING_ROOM_ROUTE && !pathname.includes('submit-kyc-retry')) {
            console.warn(`[MIDDLEWARE VERIFICATION REJECT] Catching unverified vendor application.`);
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