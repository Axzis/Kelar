
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
import { GalleryVertical, DollarSign, Star, PackageOpen } from 'lucide-react';
import Link from 'next/link';

const newJobs = [
  {
    id: 'REQ-012',
    service: 'Butuh Desainer Interior',
    category: 'Desain',
    budget: 'Rp 5.000.000 - Rp 10.000.000',
    postedDate: '2 jam lalu',
  },
  {
    id: 'REQ-011',
    service: 'Cari Tukang Kebun Harian',
    category: 'Perawatan Rumah',
    budget: 'Rp 150.000 / hari',
    postedDate: '1 hari lalu',
  },
  {
    id: 'REQ-010',
    service: 'Jasa Angkut Pindahan Apartemen',
    category: 'Logistik',
    budget: 'Rp 750.000',
    postedDate: '3 hari lalu',
  },
];


export default function DashboardPenyediaPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">
                Halo, Penyedia Jasa!
            </h1>
            <p className="text-muted-foreground">
                Kelola pekerjaan, portofolio, dan lihat statistik kinerja Anda.
            </p>
        </div>
        <Button size="lg">
          <GalleryVertical className="mr-2 h-5 w-5" />
          Kelola Portofolio Anda
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
            <div className="text-2xl font-bold">Rp 12.550.000</div>
            <p className="text-xs text-muted-foreground">
              +20.1% dari bulan lalu
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
            <div className="text-2xl font-bold">4.9/5.0</div>
            <p className="text-xs text-muted-foreground">
              Dari 52 ulasan pelanggan
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
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Menunggu respon dari calon penyewa.
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pekerjaan Baru yang Tersedia</CardTitle>
            <CardDescription>Berikut adalah permintaan jasa terbaru yang sesuai dengan keahlian Anda.</CardDescription>
          </CardHeader>
          <CardContent>
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
                {newJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.service}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{job.category}</Badge>
                    </TableCell>
                    <TableCell>{job.budget}</TableCell>
                    <TableCell>{job.postedDate}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="secondary" size="sm">Lihat Detail</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
