
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
import { PlusCircle, Activity, DollarSign, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { CreateRequestModal } from '@/components/dashboard/penyewa/create-request-modal';
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { format, fromUnixTime } from 'date-fns';
import { id } from 'date-fns/locale';


interface Job {
  id: string;
  title: string;
  hirerName: string;
  status: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  budget: number;
  provider?: string; // Asumsi penyedia akan ditambahkan nanti
}


const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  'SELESAI': 'default',
  'DALAM PENGERJAAN': 'secondary',
  'MENUNGGU PEMBAYARAN': 'outline',
  'DIBATALKAN': 'destructive',
  'OPEN': 'secondary',
};

const statusDisplay: { [key: string]: string } = {
    'SELESAI': 'Selesai',
    'DALAM PENGERJAAN': 'Dalam Pengerjaan',
    'MENUNGGU PEMBAYARAN': 'Menunggu Pembayaran',
    'DIBATALKAN': 'Dibatalkan',
    'OPEN': 'Mencari Penyedia',
};


export default function DashboardPenyewaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      const q = query(
        collection(db, 'jobs'),
        where('hirerId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
        const jobsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Job[];
        setJobs(jobsData);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching jobs: ", error);
        setLoading(false);
      });

      return () => unsubscribeFirestore();
    } else {
      setJobs([]); // Clear jobs if user logs out
    }
  }, [currentUser]);

  const activeJobsCount = jobs.filter(job => job.status === 'DALAM PENGERJAAN' || job.status === 'MENUNGGU PEMBAYARAN').length;
  const totalSpending = jobs.filter(job => job.status === 'SELESAI').reduce((sum, job) => sum + job.budget, 0);


  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">
            Selamat Datang, {currentUser?.displayName || 'Pengguna'}!
            </h1>
            <p className="text-muted-foreground">
                Lihat ringkasan dan kelola semua pekerjaan Anda di sini.
            </p>
        </div>
        <CreateRequestModal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
            <Button size="lg" onClick={() => setIsModalOpen(true)}>
                <PlusCircle className="mr-2 h-5 w-5" />
                Buat Permintaan Jasa Baru
            </Button>
        </CreateRequestModal>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pekerjaan Aktif
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobsCount}</div>
            <p className="text-xs text-muted-foreground">
              Total pekerjaan yang sedang berjalan.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pengeluaran
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalSpending)}
            </div>
            <p className="text-xs text-muted-foreground">
              Total dari semua pekerjaan yang selesai.
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pekerjaan Terbaru</CardTitle>
            <CardDescription>Berikut adalah daftar pekerjaan yang baru-baru ini Anda buat.</CardDescription>
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
                    <TableHead>ID Pekerjaan</TableHead>
                    <TableHead>Layanan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Penyedia Jasa</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Biaya</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {jobs.length > 0 ? jobs.map((job) => (
                    <TableRow key={job.id}>
                        <TableCell className="font-medium truncate max-w-20">{job.id}</TableCell>
                        <TableCell>{job.title}</TableCell>
                        <TableCell>
                        <Badge variant={statusVariant[job.status] || 'default'}>{statusDisplay[job.status] || 'Tidak Diketahui'}</Badge>
                        </TableCell>
                        <TableCell>{job.provider || '-'}</TableCell>
                        <TableCell>{job.createdAt ? format(fromUnixTime(job.createdAt.seconds), 'd MMMM yyyy', { locale: id }) : '-'}</TableCell>
                        <TableCell className="text-right">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(job.budget)}
                        </TableCell>
                    </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24">
                                Anda belum membuat permintaan jasa.
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
