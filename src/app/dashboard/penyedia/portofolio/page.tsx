
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MoreVertical, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PortfolioModal } from '@/components/dashboard/penyedia/portfolio-modal';

// Data placeholder untuk portofolio
const portfolioItems = [
  {
    id: 'folio1',
    title: 'Renovasi Dapur Modern',
    description: 'Proyek renovasi dapur lengkap dengan instalasi kabinet kustom dan countertop granit di area Jakarta Selatan.',
    imageUrl: 'https://picsum.photos/seed/kitchen-reno/400/300',
    category: 'Jasa Tukang',
    date: '2023-10-15',
  },
  {
    id: 'folio2',
    title: 'Logo & Branding Kopi Rindang',
    description: 'Desain logo dan materi branding untuk kedai kopi lokal, mencakup desain menu, kemasan, dan media sosial.',
    imageUrl: 'https://picsum.photos/seed/coffee-brand/400/300',
    category: 'Desain & Kreatif',
    date: '2023-09-22',
  },
  {
    id: 'folio3',
    title: 'Taman Vertikal Balkon Apartemen',
    description: 'Pemasangan taman vertikal untuk memaksimalkan ruang hijau di balkon apartemen tipe studio.',
    imageUrl: 'https://picsum.photos/seed/vertical-garden/400/300',
    category: 'Jasa Kebersihan', // Placeholder, mungkin butuh kategori "Tukang Kebun"
    date: '2023-08-01',
  },
];

export default function PortfolioPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portofolio Saya</h1>
          <p className="text-muted-foreground">
            Tunjukkan hasil kerja terbaik Anda kepada calon pelanggan.
          </p>
        </div>
        <PortfolioModal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
            <Button size="lg" onClick={() => setIsModalOpen(true)}>
                <PlusCircle className="mr-2 h-5 w-5" />
                Tambah Portofolio
            </Button>
        </PortfolioModal>
      </div>

      {/* Daftar Portofolio */}
      {portfolioItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioItems.map((item) => (
            <Card key={item.id} className="flex flex-col">
              <CardHeader>
                <div className="relative h-48 w-full">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-2">
                <Badge variant="secondary">{item.category}</Badge>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                 <p className="text-sm text-muted-foreground">
                    Selesai: {new Date(item.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Hapus</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-10 text-center">
            <h3 className="text-xl font-semibold">Portofolio Anda Masih Kosong</h3>
            <p className="mt-2 text-muted-foreground">
              Klik "Tambah Portofolio" untuk mulai menambahkan hasil kerja terbaik Anda.
            </p>
          </CardContent>
        </Card>
      )}
       <PortfolioModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
