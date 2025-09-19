
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Tag, Star, User, DollarSign, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { format, fromUnixTime } from 'date-fns';
import { id } from 'date-fns/locale';

// Interface untuk data pekerjaan
interface Job {
  id: string;
  title: string;
  category: string;
  status: 'SELESAI' | 'DALAM PENGERJAAN' | 'MENUNGGU PEMBAYARAN' | 'DIBATALKAN' | 'OPEN';
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  budget: number;
  description: string;
  photoUrl?: string;
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


// Data placeholder untuk daftar penawar (akan diganti nanti)
const bidders = [
  {
    id: 'p1',
    name: 'Budi Perkasa',
    avatarUrl: 'https://picsum.photos/seed/provider1/100/100',
    rating: 4.9,
    reviews: 120,
  },
  {
    id: 'p2',
    name: 'CV. Jaya Konstruksi',
    avatarUrl: 'https://picsum.photos/seed/provider2/100/100',
    rating: 4.8,
    reviews: 88,
  },
  {
    id: 'p3',
    name: 'Slamet Riyadi',
    avatarUrl: 'https://picsum.photos/seed/provider3/100/100',
    rating: 4.7,
    reviews: 95,
  },
];

export default function JobDetailPage({ params }: { params: { jobId: string } }) {
  const [jobDetails, setJobDetails] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.jobId) {
      setLoading(true);
      const jobDocRef = doc(db, 'jobs', params.jobId);
      
      const unsubscribe = onSnapshot(jobDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setJobDetails({ 
            id: doc.id,
            title: data.title,
            category: data.category,
            status: data.status,
            createdAt: data.createdAt,
            budget: data.budget,
            description: data.description,
            photoUrl: data.photoUrl,
           } as Job);
        } else {
          console.error("No such document!");
          setJobDetails(null);
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching job details: ", error);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [params.jobId]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!jobDetails) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold">Pekerjaan tidak ditemukan</h2>
        <p className="text-muted-foreground">Pekerjaan yang Anda cari mungkin telah dihapus atau tidak ada.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/penyewa/pekerjaan">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Pekerjaan
          </Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/penyewa/pekerjaan">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Detail Pekerjaan</h1>
      </div>

      {/* Detail Pekerjaan */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
                <CardTitle className="text-2xl">{jobDetails.title}</CardTitle>
                <CardDescription className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        {jobDetails.category}
                    </span>
                    <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Dibuat pada {jobDetails.createdAt ? format(fromUnixTime(jobDetails.createdAt.seconds), 'd MMMM yyyy', { locale: id }) : '-'}
                    </span>
                     <span className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Anggaran: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(jobDetails.budget)}
                    </span>
                </CardDescription>
            </div>
            <Badge variant={statusVariant[jobDetails.status] || 'default'}>
              {statusDisplay[jobDetails.status] || 'Status Tidak Diketahui'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
            <Separator className="my-4" />
            <h3 className="text-lg font-semibold mb-2">Deskripsi Lengkap</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{jobDetails.description}</p>
        </CardContent>
      </Card>

      {/* Daftar Penawar */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Daftar Penawar ({bidders.length})</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bidders.map((bidder) => (
            <Card key={bidder.id} className="flex flex-col">
              <CardHeader className="flex-1">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={bidder.avatarUrl} alt={bidder.name} />
                    <AvatarFallback>{bidder.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{bidder.name}</CardTitle>
                    <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{bidder.rating}</span>
                      <span>({bidder.reviews} ulasan)</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="w-full">
                  <User className="mr-2 h-4 w-4" />
                  Lihat Profil
                </Button>
                <Button className="w-full">Terima Tawaran</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
         {bidders.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Belum ada penyedia jasa yang memberikan penawaran untuk pekerjaan ini.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
