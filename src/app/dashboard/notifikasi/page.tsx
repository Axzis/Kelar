
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCheck, Bell } from 'lucide-react';
import Link from 'next/link';
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
  doc
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


interface Notification {
  id: string;
  message: string;
  linkTo: string;
  isRead: boolean;
  createdAt: Timestamp;
}

export default function NotifikasiPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    // Modified query: removed orderBy to avoid needing a composite index
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];
      
      // Sort notifications on the client-side
      const sortedNotifs = notifs.sort((a, b) => {
          const dateA = a.createdAt ? a.createdAt.toDate() : new Date(0);
          const dateB = b.createdAt ? b.createdAt.toDate() : new Date(0);
          return dateB.getTime() - dateA.getTime();
      });

      setNotifications(sortedNotifs);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching notifications: ", error);
        setLoading(false);
    });
    
    return () => unsubscribe();
  }, [currentUser]);

  const handleMarkAllAsRead = async () => {
    if (!currentUser) return;
    const unreadNotifications = notifications.filter(n => !n.isRead);
    if (unreadNotifications.length === 0) return;

    const batch = writeBatch(db);
    // Get unread documents from Firestore to mark them as read
     const q = query(
        collection(db, "notifications"),
        where("userId", "==", currentUser.uid),
        where("isRead", "==", false)
    );
    const unreadDocs = await getDocs(q);
    
    unreadDocs.forEach(document => {
        batch.update(doc(db, 'notifications', document.id), { isRead: true });
    });

    try {
        await batch.commit();
    } catch (error) {
        console.error("Error marking all as read: ", error);
    }
  };
  
  const formatNotificationTime = (timestamp: Timestamp) => {
    if (!timestamp) return 'Baru saja';
    return formatDistanceToNow(timestamp.toDate(), { addSuffix: true, locale: id });
  };
  
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifikasi</h1>
          <p className="text-muted-foreground">
            Lihat semua pembaruan terkait aktivitas Anda di sini.
          </p>
        </div>
        <Button onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
          <CheckCheck className="mr-2 h-4 w-4" />
          Tandai Semua Terbaca
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Notifikasi</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : notifications.length > 0 ? (
            <div className="flex flex-col">
              {notifications.map((notif) => (
                <Link
                  href={notif.linkTo || '#'}
                  key={notif.id}
                  className={cn(
                    'flex items-center gap-4 p-4 -mx-4 border-b transition-colors hover:bg-muted/50',
                    !notif.isRead && 'bg-primary/5 hover:bg-primary/10'
                  )}
                >
                  <Avatar className="h-10 w-10 flex-shrink-0 border">
                    <AvatarImage src={`https://picsum.photos/seed/${notif.id}/100/100`} />
                    <AvatarFallback><Bell size={20}/></AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className={cn("text-sm leading-snug", !notif.isRead && "font-semibold")}>{notif.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatNotificationTime(notif.createdAt)}
                    </p>
                  </div>
                   {!notif.isRead && (
                        <div className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-primary" title="Belum dibaca"></div>
                    )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-20 text-center">
                <Bell className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Tidak Ada Notifikasi</h3>
                <p className="mt-1 text-sm text-muted-foreground">Anda akan melihat pembaruan di sini setelah ada aktivitas baru.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
