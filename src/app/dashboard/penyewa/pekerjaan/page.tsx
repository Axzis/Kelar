
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
import { PlusCircle, Activity, DollarSign, Loader2, Eye } from 'lucide-react';
import { CreateRequestModal } from '@/components/dashboard/penyewa/create-request-modal';
import { useState, useEffect, useMemo } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { format, fromUnixTime } from 'date-fns';
import { id } from 'date-fns/locale';
import Link from 'next/link';

// Interface untuk mendefinisikan struktur data pekerjaan
interface Job {
  id: string;
  title: string;
  hirerName: string;
  status: 'SELESAI' | 'DALAM PENGERJAAN' | 'MENUNGGU PEMBAYARAN' | 'DIBATALKAN' | 'OPEN';
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  budget: number;
  provider?: string;
}

// Objek untuk memetakan status pekerjaan ke varian warna Badge
const statusVariant: { [key in Job['status']]: "default" | "secondary" | "destructive" | "outline" } = {
  'SELESAI': 'default',
  'DALAM PENGERJAAN': 'secondary',
  'MENUNGGU PEMBAYARAN': 'outline',
  'DIBATALKAN': 'destructive',
  'OPEN': 'secondary',
};

// Objek untuk memetakan status pekerjaan ke teks yang lebih ramah pengguna
const statusDisplay: { [key in Job['status']]: string } = {
    'SELESAI': 'Selesai',
    'DALAM PENGERJAAN': 'Dalam Pengerjaan',
    'MENUNGGU PEMBAYARAN': 'Menunggu Pembayaran',
    'DIBATALKAN': 'Dibatalkan',
    'OPEN': 'Mencari Penyedia',
};

export default function DashboardPekerjaanPenyewaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Efek untuk memantau status otentikasi pengguna
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  // Efek untuk mengambil data pekerjaan dari Firestore secara real-time
  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      const q = query(
        collection(db, 'jobs'),
        where('hirerId', '==', currentUser.uid)
      );

      const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
        const jobsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Job[];
        
        // Melakukan sorting di sisi client
        const sortedJobs = jobsData.sort((a, b) => {
            const dateA = a.createdAt ? fromUnixTime(a.createdAt.seconds) : new Date(0);
            const dateB = b.createdAt ? fromUnixTime(b.createdAt.seconds) : new Date(0);
            return dateB.getTime() - dateA.getTime();
        });
        
        setJobs(sortedJobs);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching jobs: ", error);
        setLoading(false);
      });

      return () => unsubscribeFirestore();
    } else {
      // Jika tidak ada user, kosongkan data dan berhenti loading
      setJobs([]);
      setLoading(false);
    }
  }, [currentUser]);

  // Menghitung jumlah pekerjaan aktif dengan useMemo untuk optimasi
  const activeJobsCount = useMemo(() => {
    return jobs.filter(job => job.status === 'DALAM PENGERJAAN' || job.status === 'MENUNGGU PEMBAYARAN').length;
  }, [jobs]);

  // Menghitung total pengeluaran dari pekerjaan yang selesai
  const totalSpending = useMemo(() => {
    return jobs.filter(job => job.status === 'SELESAI').reduce((sum, job) => sum + job.budget, 0);
  }, [jobs]);

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Pekerjaan Saya
          </h1>
          <p className="text-muted-foreground">
            Lacak dan kelola semua permintaan jasa yang telah Anda buat.
          </p>
        </div>
        <CreateRequestModal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
          <Button size="lg" onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="mr-2 h-5 w-5" />
            Buat Permintaan Baru
          </Button>
        </CreateRequestModal>
      </div>

      {/* Tabel Daftar Pekerjaan */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Permintaan Jasa</CardTitle>
            <CardDescription>Berikut adalah daftar semua permintaan jasa yang pernah Anda buat.</CardDescription>
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
                    <TableHead>Layanan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Penyedia Jasa</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Biaya</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.length > 0 ? jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[job.status] || 'default'}>{statusDisplay[job.status] || 'Tidak Diketahui'}</Badge>
                      </TableCell>
                      <TableCell>{job.provider || '-'}</TableCell>
                      <TableCell>{job.createdAt ? format(fromUnixTime(job.createdAt.seconds), 'd MMM yyyy', { locale: id }) : '-'}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(job.budget)}
                      </TableCell>
                      <TableCell className="text-right">
                         <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/penyewa/pekerjaan/${job.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Detail
                            </Link>
                         </Button>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24">
                        Anda belum membuat permintaan jasa. Klik "Buat Permintaan Baru" untuk memulai.
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
