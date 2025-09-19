
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
} from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/dashboard/penyewa', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/penyewa/pekerjaan', label: 'Pekerjaan Saya', icon: Briefcase },
  { href: '/dashboard/penyewa/pembayaran', label: 'Pembayaran', icon: CreditCard },
  { href: '/dashboard/penyewa/profil', label: 'Profil Saya', icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
                    <Link href="/dashboard/penyewa/pengaturan" passHref>
                        <SidebarMenuButton isActive={pathname === '/dashboard/penyewa/pengaturan'} tooltip={{children: 'Pengaturan'}}>
                            <Settings />
                            <span>Pengaturan</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <Link href="/" passHref>
                        <SidebarMenuButton tooltip={{children: 'Keluar'}}>
                            <LogOut />
                            <span>Keluar</span>
                        </SidebarMenuButton>
                    </Link>
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
