
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Eye } from 'lucide-react';
import Link from 'next/link';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, onSnapshot, getDocs, doc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { format, fromUnixTime } from 'date-fns';
import { id } from 'date-fns/locale';

interface Bid {
  id: string; // bid document id (provider uid)
  jobId: string;
  jobTitle: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: Timestamp;
}

const statusVariant: { [key in Bid['status']]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  ACCEPTED: 'default',
  PENDING: 'secondary',
  REJECTED: 'destructive',
};

const statusDisplay: { [key in Bid['status']]: string } = {
  ACCEPTED: 'Diterima',
  PENDING: 'Menunggu Respon',
  REJECTED: 'Ditolak',
};

export default function TawaranSayaPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [myBids, setMyBids] = useState<Bid[]>([]);
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

    const fetchBids = async () => {
        const jobsSnapshot = await getDocs(collection(db, 'jobs'));
        const bidsData: Bid[] = [];

        for (const jobDoc of jobsSnapshot.docs) {
            const bidDocRef = doc(db, 'jobs', jobDoc.id, 'bids', currentUser.uid);
            const bidDocSnap = await getDoc(bidDocRef);

            if (bidDocSnap.exists()) {
                const bidData = bidDocSnap.data();
                bidsData.push({
                    id: bidDocSnap.id,
                    jobId: jobDoc.id,
                    jobTitle: jobDoc.data().title,
                    ...bidData,
                } as Bid);
            }
        }
        
        const sortedBids = bidsData.sort((a, b) => {
            const dateA = a.createdAt ? fromUnixTime(a.createdAt.seconds) : new Date(0);
            const dateB = b.createdAt ? fromUnixTime(b.createdAt.seconds) : new Date(0);
            return dateB.getTime() - dateA.getTime();
        });

        setMyBids(sortedBids);
        setLoading(false);
    };

    fetchBids();
    
    // We can't use onSnapshot easily here without a collection group query which needs an index
    // So we fetch once. For real-time updates, a more complex listener setup or background function would be needed.

  }, [currentUser]);

  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return '-';
    return format(timestamp.toDate(), 'd MMM yyyy, HH:mm', { locale: id });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tawaran Saya</h1>
        <p className="text-muted-foreground">
          Lacak dan kelola semua tawaran yang telah Anda kirimkan.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Tawaran</CardTitle>
          <CardDescription>
            Berikut adalah daftar semua tawaran yang pernah Anda kirimkan untuk
            berbagai pekerjaan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul Pekerjaan</TableHead>
                  <TableHead>Tanggal Tawaran</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myBids.length > 0 ? (
                  myBids.map((bid) => (
                    <TableRow key={`${bid.jobId}-${bid.id}`}>
                      <TableCell className="font-medium">{bid.jobTitle}</TableCell>
                      <TableCell>{formatDate(bid.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[bid.status] || 'outline'}>
                          {statusDisplay[bid.status] || bid.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/penyewa/pekerjaan/${bid.jobId}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Anda belum pernah mengirimkan tawaran.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

