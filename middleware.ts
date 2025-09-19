import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Asumsikan token otentikasi disimpan dalam cookie.
  // Nama cookie mungkin perlu disesuaikan tergantung pada implementasi otentikasi Anda.
  // Untuk Firebase Auth di sisi klien, status login dikelola secara berbeda,
  // namun untuk SSR/Middleware, pemeriksaan cookie adalah pendekatan umum.
  // Firebase Auth SDK sendiri tidak mengatur cookie HTTP-only secara default.
  // Kode ini mengasumsikan Anda memiliki mekanisme untuk mengatur cookie setelah login.
  // Nama cookie 'session' adalah placeholder umum.
  const sessionCookie = request.cookies.get('session');

  const { pathname } = request.nextUrl;

  // Jika pengguna mencoba mengakses dasbor tanpa sesi/cookie
  if (!sessionCookie && pathname.startsWith('/dashboard')) {
    // Alihkan ke halaman login
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  // Jika pengguna sudah login dan mencoba mengakses halaman login/registrasi,
  // mungkin kita bisa arahkan mereka ke dasbor. (Opsional, tapi praktik yang baik)
  if (sessionCookie && (pathname === '/login' || pathname === '/registrasi')) {
     return NextResponse.redirect(new URL('/dashboard/penyewa', request.url));
  }


  return NextResponse.next();
}

// Tentukan rute mana yang akan menggunakan Middleware ini
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/registrasi',
  ],
}
