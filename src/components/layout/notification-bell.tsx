
'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// --- Static Data (Placeholder) ---
const notifications = [
  {
    id: 'notif-1',
    read: false,
    avatar: 'https://picsum.photos/seed/provider1/100/100',
    name: 'Andi Tukang AC',
    message: 'mengirimkan penawaran untuk pekerjaan "Servis AC Rutin".',
    time: '5 menit yang lalu',
  },
  {
    id: 'notif-2',
    read: false,
    avatar: 'https://picsum.photos/seed/provider2/100/100',
    name: 'Desain Cepat',
    message: 'mengirimkan penawaran untuk pekerjaan "Logo Kafe Kekinian".',
    time: '15 menit yang lalu',
  },
  {
    id: 'notif-3',
    read: true,
    avatar: 'https://picsum.photos/seed/system/100/100',
    name: 'Sistem',
    message: 'Tawaran Anda untuk "Perbaikan Atap" telah diterima oleh klien!',
    time: '1 jam yang lalu',
  },
  {
    id: 'notif-4',
    read: true,
    avatar: 'https://picsum.photos/seed/client1/100/100',
    name: 'Budi Hartono',
    message: 'mengirimkan pesan baru mengenai "Proyek Renovasi Teras".',
    time: '3 jam yang lalu',
  },
   {
    id: 'notif-5',
    read: true,
    avatar: 'https://picsum.photos/seed/system/100/100',
    name: 'Sistem',
    message: 'Selamat datang di KelarApp! Lengkapi profil Anda sekarang.',
    time: '1 hari yang lalu',
  },
];
// --- End of Static Data ---

export function NotificationBell() {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
          <span className="sr-only">Buka notifikasi</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Notifikasi</h3>
            <Button variant="ghost" size="sm" className="text-xs">
                <CheckCheck className="mr-2 h-4 w-4"/>
                Tandai terbaca
            </Button>
        </div>
        <ScrollArea className="h-96">
            <div className="flex flex-col">
                 {notifications.length > 0 ? (
                    notifications.map((notif) => (
                    <div
                        key={notif.id}
                        className={cn(
                        'flex items-start gap-3 p-4 border-b hover:bg-secondary',
                        !notif.read && 'bg-primary/5'
                        )}
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={notif.avatar} alt={notif.name} />
                            <AvatarFallback>{notif.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-sm">
                            <p>
                                <span className="font-semibold">{notif.name}</span>{' '}
                                {notif.message}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">{notif.time}</p>
                        </div>
                    </div>
                    ))
                ) : (
                    <p className="p-4 text-center text-sm text-muted-foreground">
                        Belum ada notifikasi.
                    </p>
                )}
            </div>
        </ScrollArea>
        <div className="p-2 border-t">
            <Button variant="link" size="sm" asChild className="w-full">
                <Link href="/dashboard/notifikasi">Lihat semua notifikasi</Link>
            </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
