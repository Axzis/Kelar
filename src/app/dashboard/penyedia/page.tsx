
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
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
import { GalleryVertical, DollarSign, Star, PackageOpen, Loader2, Check } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { format, fromUnixTime, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';


interface Job {
  id: string;
  title: string;
  category: string;
  budget: number;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

interface BidStatus {
  [jobId: string]: boolean;
}


export default function DashboardPenyediaPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [myBids, setMyBids] = useState<BidStatus>({});
  const [biddingJobId, setBiddingJobId] = useState<string | null>(null);
  const { toast } = useToast();

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
    };
    
    setLoading(true);
    const q = query(
      collection(db, 'jobs'),
      where('status', '==', 'OPEN')
    );

    const unsubscribeFirestore = onSnapshot(q, async (querySnapshot) => {
      const jobsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Job[];
      
      const sortedJobs = jobsData.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
      setAvailableJobs(sortedJobs);

      // Check for existing bids
      const bidStatus: BidStatus = {};
      for (const job of sortedJobs) {
        const bidDocRef = doc(db, 'jobs', job.id, 'bids', currentUser.uid);
        const bidDoc = await getDoc(bidDocRef);
        if (bidDoc.exists()) {
          bidStatus[job.id] = true;
        }
      }
      setMyBids(bidStatus);

      setLoading(false);
    }, (error) => {
      console.error("Error fetching available jobs: ", error);
      setLoading(false);
    });

    return () => unsubscribeFirestore();
  }, [currentUser]);


  const handleBid = async (jobId: string) => {
    if (!currentUser) {
      toast({
        variant: 'destructive',
        title: 'Anda harus login',
        description: 'Silakan login untuk memberikan penawaran.',
      });
      return;
    }

    setBiddingJobId(jobId);

    try {
      // 1. Get provider data
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        throw new Error('Data penyedia jasa tidak ditemukan.');
      }
      const userData = userDoc.data();

      // 2. Create bid document reference
      const bidDocRef = doc(db, 'jobs', jobId, 'bids', currentUser.uid);

      // 3. Denormalize data and set it
      await setDoc(bidDocRef, {
        providerId: currentUser.uid,
        providerName: userData.nama || 'Tanpa Nama',
        providerRating: 4.8, // Placeholder rating
        providerAvatarUrl: userData.photoURL || `https://picsum.photos/seed/${currentUser.uid}/100/100`, // Placeholder avatar
        reviews: 15, // Placeholder review count
        createdAt: Timestamp.now(),
        status: 'PENDING',
      });

      // 4. Update local state and give feedback
      setMyBids(prev => ({ ...prev, [jobId]: true }));
      toast({
        title: 'Tawaran Terkirim!',
        description: 'Anda telah berhasil memberikan penawaran untuk pekerjaan ini.',
      });

    } catch (error) {
      console.error('Error placing bid:', error);
      toast({
        variant: 'destructive',
        title: 'Gagal Mengirim Tawaran',
        description: 'Terjadi kesalahan saat memproses permintaan Anda.',
      });
    } finally {
      setBiddingJobId(null);
    }
  };


  const formatPostedDate = (date: { seconds: number; nanoseconds: number }) => {
    if (!date) return '-';
    return formatDistanceToNow(fromUnixTime(date.seconds), { addSuffix: true, locale: id });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">
                Halo, {currentUser?.displayName || 'Penyedia Jasa'}!
            </h1>
            <p className="text-muted-foreground">
                Kelola pekerjaan, portofolio, dan lihat statistik kinerja Anda.
            </p>
        </div>
        <Button size="lg" asChild>
          <Link href="/dashboard/penyedia/portofolio">
            <GalleryVertical className="mr-2 h-5 w-5" />
            Kelola Portofolio Anda
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pendapatan (Bulan Ini)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 0</div>
            <p className="text-xs text-muted-foreground">
              Data belum tersedia
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rating Rata-rata
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">N/A</div>
            <p className="text-xs text-muted-foreground">
              Belum ada ulasan
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tawaran Aktif
            </CardTitle>
            <PackageOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
                Data belum tersedia
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pekerjaan Baru yang Tersedia</CardTitle>
            <CardDescription>Berikut adalah permintaan jasa terbaru yang bisa Anda ambil.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
                 <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
             ) : (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Pekerjaan</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Anggaran</TableHead>
                    <TableHead>Diposting</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {availableJobs.length > 0 ? availableJobs.map((job) => (
                    <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>
                        <Badge variant="outline">{job.category}</Badge>
                        </TableCell>
                        <TableCell>
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(job.budget)}
                        </TableCell>
                        <TableCell>{formatPostedDate(job.createdAt)}</TableCell>
                        <TableCell className="text-right">
                           <Button
                                variant={myBids[job.id] ? 'secondary' : 'default'}
                                size="sm"
                                onClick={() => handleBid(job.id)}
                                disabled={myBids[job.id] || biddingJobId === job.id}
                            >
                                {biddingJobId === job.id ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : myBids[job.id] ? (
                                    <Check className="mr-2 h-4 w-4" />
                                ) : null}
                                {biddingJobId === job.id ? 'Mengirim...' : myBids[job.id] ? 'Tawaran Terkirim' : 'Berikan Penawaran'}
                            </Button>
                        </TableCell>
                    </TableRow>
                    )) : (
                         <TableRow>
                            <TableCell colSpan={5} className="text-center h-24">
                                Saat ini belum ada pekerjaan yang tersedia.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    