import { Facebook, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-secondary text-foreground">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <Link href="/" className="text-2xl font-bold text-primary font-headline">
              Kelar
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Platform terpercaya untuk menemukan dan menawarkan jasa terbaik di sekitar Anda.
            </p>
            <div className="mt-6 flex gap-4">
              <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-6 w-6" />
              </Link>
              <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-6 w-6" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-2 sm:grid-cols-3">
            <div>
              <p className="font-medium text-foreground">Layanan</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Perbaikan Rumah</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Les Privat</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Desain Grafis</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Fotografi</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground">Tentang Kami</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Tentang Kelar</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Karir</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Blog</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground">Legal</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Syarat & Ketentuan</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Kebijakan Privasi</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} KelarApp. Semua hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
