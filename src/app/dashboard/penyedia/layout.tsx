
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
  GalleryVertical,
  User,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';


const menuItems = [
  { href: '/dashboard/penyedia', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/penyedia/pekerjaan', label: 'Pekerjaan Tersedia', icon: Briefcase },
  { href: '/dashboard/penyedia/tawaran', label: 'Tawaran Saya', icon: Sparkles },
  { href: '/dashboard/penyedia/portofolio', label: 'Portofolio', icon: GalleryVertical },
  { href: '/dashboard/penyedia/profil', label: 'Profil Saya', icon: User },
];

export default function DashboardPenyediaLayout({
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
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
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
                    <Link href="/dashboard/penyedia/pengaturan" passHref>
                        <SidebarMenuButton isActive={pathname === '/dashboard/penyedia/pengaturan'} tooltip={{children: 'Pengaturan'}}>
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
                            <AvatarImage src="https://picsum.photos/seed/provider-avatar/100/100" />
                            <AvatarFallback>PN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col truncate">
                            <span className="font-semibold text-sm">Penyedia Jasa</span>
                            <span className="text-xs text-muted-foreground">penyedia@email.com</span>
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
