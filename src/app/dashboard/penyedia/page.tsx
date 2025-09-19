
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
import { GalleryVertical, DollarSign, Star, PackageOpen, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { format, fromUnixTime, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

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

export default function DashboardPenyediaPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, 'jobs'),
      where('status', '==', 'OPEN'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
      const jobsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Job[];
      setAvailableJobs(jobsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching available jobs: ", error);
      setLoading(false);
    });

    return () => unsubscribeFirestore();
  }, []);


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
                            <Button variant="secondary" size="sm">Lihat Detail</Button>
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
