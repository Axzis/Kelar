
import { NextResponse, type NextRequest } from 'next/server';
import { initAdmin } from '@/lib/firebase-admin';
import { auth } from 'firebase-admin';

initAdmin();

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/login' || pathname === '/registrasi';

  // Jika tidak ada session cookie
  if (!sessionCookie) {
    // Jika mencoba mengakses halaman dashboard, redirect ke login
    if (pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Jika di halaman auth atau publik, lanjutkan
    return NextResponse.next();
  }

  // Jika ada session cookie, verifikasi
  try {
    // Verifikasi cookie sesi
    await auth().verifySessionCookie(sessionCookie, true);

    // Jika pengguna sudah login dan mencoba mengakses halaman login/registrasi,
    // redirect mereka ke dashboard default (misalnya penyewa)
    if (isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard/penyewa', request.url));
    }

    // Jika pengguna sudah login dan mengakses halaman lain, lanjutkan
    return NextResponse.next();

  } catch (error) {
    // Jika cookie tidak valid (error verifikasi)
    // Buat response untuk redirect ke login
    const response = NextResponse.redirect(new URL('/login', request.url));
    
    // Hapus cookie yang tidak valid dari browser
    response.cookies.delete('session');
    
    // Jika path yang diminta adalah dashboard atau halaman auth, lakukan redirect dengan cookie yang sudah dihapus
    if (pathname.startsWith('/dashboard') || isAuthPage) {
        return response;
    }
    
    // Jika path lain, cukup hapus cookie dan lanjutkan ke tujuan
    const nextResponse = NextResponse.next();
    nextResponse.cookies.delete('session');
    return nextResponse;
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/registrasi'],
};
