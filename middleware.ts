import { NextResponse, type NextRequest } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin';
import { auth } from 'firebase-admin';

initAdmin();

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/login' || pathname === '/registrasi';

  if (!sessionCookie) {
    if (isAuthPage) {
      return NextResponse.next();
    }
    // Jika tidak ada sesi dan mencoba akses halaman dasbor, alihkan ke login
    if (pathname.startsWith('/dashboard')) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Jika ada sesi, verifikasi token
  try {
    const decodedToken = await auth().verifySessionCookie(sessionCookie, true);
    const userDoc = await auth().getUser(decodedToken.uid);
    // Asumsikan peran disimpan dalam custom claims atau Anda perlu fetch dari Firestore
    // Untuk contoh ini, kita anggap peran ada di custom claims atau kita fetch
    // Di sini kita tidak punya akses langsung ke firestore, jadi kita akan redirect berdasarkan role dari login page

    if (isAuthPage) {
      // Jika pengguna sudah login dan mencoba akses login/registrasi, redirect ke dashboard
      // Peran tidak tersedia langsung di sini tanpa query tambahan, jadi kita redirect ke path umum
      // atau membuat asumsi. Redirect ke beranda adalah opsi aman.
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    return NextResponse.next();

  } catch (error) {
    // Sesi tidak valid, hapus cookie dan alihkan ke login
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session');
    
    if (pathname.startsWith('/dashboard')) {
        return response;
    }

    // Jika di halaman lain, cukup hapus cookie dan lanjutkan
    const nextResponse = NextResponse.next();
    nextResponse.cookies.delete('session');
    return nextResponse;
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/registrasi'],
};
