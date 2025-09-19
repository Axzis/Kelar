
'use client';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Briefcase,
  CreditCard,
  User,
  Settings,
  LogOut,
  ArrowRightLeft,
  Bell,
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const menuItems = [
  { href: '/dashboard/penyewa', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/penyewa/pekerjaan', label: 'Pekerjaan Saya', icon: Briefcase },
  { href: '/dashboard/notifikasi', label: 'Notifikasi', icon: Bell },
  { href: '/dashboard/penyewa/pembayaran', label: 'Pembayaran', icon: CreditCard },
  { href: '/dashboard/penyewa/profil', label: 'Profil Saya', icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await auth.signOut();
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

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-xl font-bold text-primary font-headline">
              Kelar
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
            <div className="p-2">
                <Button asChild className="w-full justify-start">
                    <Link href="/dashboard/penyedia">
                        <ArrowRightLeft className="mr-2" />
                        <span>Mode Penyedia</span>
                    </Link>
                </Button>
            </div>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href || (item.href === '/dashboard/notifikasi' && pathname.startsWith('/dashboard/notifikasi'))}
                    tooltip={{ children: item.label }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <Link href="/dashboard/penyewa/pengaturan" passHref>
                        <SidebarMenuButton isActive={pathname === '/dashboard/penyewa/pengaturan'} tooltip={{children: 'Pengaturan'}}>
                            <Settings />
                            <span>Pengaturan</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} tooltip={{children: 'Keluar'}}>
                        <LogOut />
                        <span>Keluar</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                     <div className="flex items-center gap-3 p-2">
                        <Avatar>
                            <AvatarImage src="https://picsum.photos/seed/user-avatar/100/100" />
                            <AvatarFallback>UN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col truncate">
                            <span className="font-semibold text-sm">User Name</span>
                            <span className="text-xs text-muted-foreground">user@email.com</span>
                        </div>
                    </div>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="md:hidden"/>
            <div className="w-full flex-1">
                {/* Bisa ditambahkan search bar di sini nanti */}
            </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
        </SidebarInset>
    </SidebarProvider>
  );
}
