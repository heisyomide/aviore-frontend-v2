'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// src/components/AuthGuard.tsx
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    console.log("GUARD: Checking access for", pathname, "with role:", role);

    if (!token) {
      router.push('/login');
      return;
    }

    // THIS IS THE LINE THAT IS LIKELY BOOTING YOU
    if (pathname.startsWith('/admin') && role !== 'admin') {
      console.error("GUARD: Access denied for", role, "on", pathname);
      router.push('/user/dashboard'); 
    }
  }, [pathname, router]);

  return <>{children}</>;
}