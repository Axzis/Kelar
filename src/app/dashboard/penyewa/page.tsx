
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
import { PlusCircle, Activity, DollarSign } from 'lucide-react';
import Link from 'next/link';

const recentJobs = [
  {
    id: 'JOB-001',
    service: 'Perbaikan Atap Bocor',
    provider: 'Budi Karya',
    status: 'Selesai',
    date: '15 Juli 2024',
    amount: 'Rp 500.000',
  },
  {
    id: 'JOB-002',
    service: 'Pemasangan AC Baru',
    provider: 'Jaya Teknik',
    status: 'Dalam Pengerjaan',
    date: '20 Juli 2024',
    amount: 'Rp 3.500.000',
  },
  {
    id: 'JOB-003',
    service: 'Les Privat Matematika',
    provider: 'Andi Wijaya',
    status: 'Menunggu Pembayaran',
    date: '22 Juli 2024',
    amount: 'Rp 800.000',
  },
   {
    id: 'JOB-004',
    service: 'Jasa Desain Logo',
    provider: 'Creative Studio',
    status: 'Dibatalkan',
    date: '18 Juli 2024',
    amount: 'Rp 1.200.000',
  },
];

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  'Selesai': 'default',
  'Dalam Pengerjaan': 'secondary',
  'Menunggu Pembayaran': 'outline',
  'Dibatalkan': 'destructive',
};


export default function DashboardPenyewaPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">
            Selamat Datang, User!
            </h1>
            <p className="text-muted-foreground">
                Lihat ringkasan dan kelola semua pekerjaan Anda di sini.
            </p>
        </div>
        <Button size="lg">
          <PlusCircle className="mr-2 h-5 w-5" />
          Buat Permintaan Jasa Baru
        </Button>
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
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Satu pekerjaan sedang dalam proses pengerjaan.
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
            <div className="text-2xl font-bold">Rp 4.800.000</div>
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
                {recentJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.id}</TableCell>
                    <TableCell>{job.service}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[job.status] || 'default'}>{job.status}</Badge>
                    </TableCell>
                    <TableCell>{job.provider}</TableCell>
                    <TableCell>{job.date}</TableCell>
                    <TableCell className="text-right">{job.amount}</TableCell>
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
