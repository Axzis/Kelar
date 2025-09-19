
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
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
  writeBatch,
  getDocs,
  limit
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

// --- Interfaces ---
interface Notification {
  id: string;
  userId: string;
  message: string;
  linkTo: string;
  isRead: boolean;
  createdAt: Timestamp;
}
// --- End of Interfaces ---


export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleMarkAllAsRead = async () => {
    if (!currentUser || notifications.filter(n => !n.isRead).length === 0) return;

    const batch = writeBatch(db);
    const q = query(
        collection(db, 'notifications'), 
        where('userId', '==', currentUser.uid),
        where('isRead', '==', false)
    );

    const unreadNotificationsSnapshot = await getDocs(q);

    unreadNotificationsSnapshot.forEach((doc) => {
        batch.update(doc.ref, { isRead: true });
    });

    try {
        await batch.commit();
    } catch (error) {
        console.error("Error marking notifications as read: ", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const formatNotificationTime = (timestamp: Timestamp) => {
    if (!timestamp) return 'Baru saja';
    return formatDistanceToNow(timestamp.toDate(), { addSuffix: true, locale: id });
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
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
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Notifikasi</h3>
            <Button variant="ghost" size="sm" className="text-xs" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
                <CheckCheck className="mr-2 h-4 w-4"/>
                Tandai terbaca
            </Button>
        </div>
        <ScrollArea className="h-96">
            <div className="flex flex-col">
                 {notifications.length > 0 ? (
                    notifications.map((notif) => (
                    <Link
                        href={notif.linkTo || '#'}
                        key={notif.id}
                        className={cn(
                        'block w-full text-left border-b hover:bg-secondary',
                        !notif.isRead && 'bg-primary/5'
                        )}
                        onClick={() => setIsOpen(false)}
                    >
                        <div className="flex items-start gap-3 p-4">
                            <Avatar className="h-8 w-8 mt-1">
                                <AvatarImage src={`https://picsum.photos/seed/${notif.id}/100/100`} />
                                <AvatarFallback><Bell size={16}/></AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-sm">
                                <p>{notif.message}</p>
                                <p className="mt-1 text-xs text-muted-foreground">{formatNotificationTime(notif.createdAt)}</p>
                            </div>
                        </div>
                    </Link>
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
