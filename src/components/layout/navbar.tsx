
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NotificationBell } from './notification-bell';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const guestNavLinks = [];

const loggedInNavLinks = [
    { href: '/dashboard/penyewa', label: 'Dashboard' },
];

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<{ nama: string; photoURL: string; role?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch additional user data from Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data() as { nama: string; photoURL: string; role?: string });
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await fetch('/api/session/logout', { method: 'POST' });
      toast({
        title: 'Logout Berhasil',
        description: 'Anda telah berhasil keluar.',
      });
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        variant: 'destructive',
        title: 'Logout Gagal',
        description: 'Terjadi kesalahan saat mencoba keluar.',
      });
    }
  };
  
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };
  
  const navLinks = user ? loggedInNavLinks : guestNavLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary font-headline">Kelar</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className="text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
            {!loading && (
                 user ? (
                    <>
                        <NotificationBell />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={userData?.photoURL} alt={userData?.nama || 'User'} />
                                        <AvatarFallback>{getInitials(userData?.nama || '')}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{userData?.nama}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                    {user.email}
                                    </p>
                                </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/penyewa/profil">
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        <span>Kelola Profil</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                 ) : (
                    <div className="hidden items-center gap-4 md:flex">
                        <Button asChild variant="outline">
                        <Link href="/registrasi" className="font-bold">Daftar</Link>
                        </Button>
                        <Button asChild>
                        <Link href="/login" className="font-bold">Masuk</Link>
                        </Button>
                    </div>
                 )
            )}
        </div>

        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Buka menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b pb-4">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                    <span className="text-xl font-bold text-primary font-headline">Kelar</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                    <X className="h-6 w-6" />
                    <span className="sr-only">Tutup menu</span>
                  </Button>
                </div>
                <nav className="mt-8 flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <Link
                      key={`${link.href}-${link.label}-mobile`}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-lg font-bold text-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-auto flex flex-col gap-4">
                    {!loading && !user && (
                        <>
                            <Button asChild variant="outline" size="lg">
                                <Link href="/registrasi" className="font-bold">Daftar</Link>
                            </Button>
                            <Button asChild size="lg">
                                <Link href="/login" className="font-bold">Masuk</Link>
                            </Button>
                        </>
                    )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
