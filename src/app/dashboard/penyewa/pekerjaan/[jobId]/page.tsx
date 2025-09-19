
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
import { ArrowLeft, Calendar, Tag, Star, User, DollarSign } from 'lucide-react';
import Link from 'next/link';

// Data placeholder untuk detail pekerjaan
const jobDetails = {
  id: 'j1',
  title: 'Perbaikan Atap Bocor Mendesak',
  category: 'Jasa Tukang',
  status: 'OPEN',
  createdAt: '15 Juli 2024',
  budget: 750000,
  description:
    'Atap rumah saya di bagian gudang mengalami kebocoran yang cukup parah saat hujan deras terakhir. Saya membutuhkan tukang yang berpengalaman untuk segera memeriksanya, menemukan sumber bocor, dan melakukan perbaikan permanen. Material yang dibutuhkan bisa didiskusikan lebih lanjut, namun saya berharap perbaikan bisa selesai dalam 1-2 hari kerja. Area yang perlu diperbaiki sekitar 2x3 meter.',
};

// Data placeholder untuk daftar penawar
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
  // Nanti kita akan menggunakan params.jobId untuk mengambil data asli
  
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
                        Dibuat pada {jobDetails.createdAt}
                    </span>
                     <span className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Anggaran: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(jobDetails.budget)}
                    </span>
                </CardDescription>
            </div>
            <Badge variant={jobDetails.status === 'OPEN' ? 'secondary' : 'default'}>
              {jobDetails.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
            <Separator className="my-4" />
            <h3 className="text-lg font-semibold mb-2">Deskripsi Lengkap</h3>
            <p className="text-muted-foreground">{jobDetails.description}</p>
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
      </div>
    </div>
  );
}
