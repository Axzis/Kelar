
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import Image from 'next/image';

// Placeholder data
const userProfile = {
  name: 'Penyedia Jasa Pro',
  specialization: 'Tukang AC, Spesialis Listrik, Renovasi Atap',
  bio: 'Saya adalah seorang profesional dengan pengalaman lebih dari 10 tahun di bidang perbaikan dan instalasi. Keahlian utama saya adalah perbaikan AC, instalasi listrik, dan renovasi atap. Saya berkomitmen untuk memberikan layanan terbaik dengan hasil yang memuaskan dan tahan lama. Kepuasan pelanggan adalah prioritas utama saya.',
  avatarUrl: 'https://picsum.photos/seed/provider-avatar/200/200',
};

const portfolioItems = [
  { id: 'p1', imageUrl: 'https://picsum.photos/seed/portfolio1/400/300' },
  { id: 'p2', imageUrl: 'https://picsum.photos/seed/portfolio2/400/300' },
  { id: 'p3', imageUrl: 'https://picsum.photos/seed/portfolio3/400/300' },
  { id: 'p4', imageUrl: 'https://picsum.photos/seed/portfolio4/400/300' },
];

export default function ProfilePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulasi proses penyimpanan
    setTimeout(() => {
        setIsSaving(false);
        // Tampilkan toast sukses di sini nanti
    }, 1500);
  };
  
    const handleUploadPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    // Simulasi proses upload
    setTimeout(() => {
        setIsUploading(false);
        setIsModalOpen(false);
         // Tampilkan toast sukses di sini nanti
    }, 1500);
  };


  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil & Portofolio</h1>
        <p className="text-muted-foreground">
          Kelola informasi publik dan pamerkan hasil kerja terbaik Anda.
        </p>
      </div>

      {/* Bagian Informasi Profil */}
      <Card>
        <form onSubmit={handleSaveChanges}>
            <CardHeader>
            <CardTitle>Informasi Profil</CardTitle>
            <CardDescription>
                Informasi ini akan ditampilkan kepada calon pelanggan Anda.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
                <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button type="button" variant="outline">
                <Camera className="mr-2 h-4 w-4" />
                Ubah Foto
                </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <Input id="fullName" defaultValue={userProfile.name} disabled />
                </div>
                <div className="space-y-2">
                <Label htmlFor="specialization">Spesialisasi</Label>
                <Input
                    id="specialization"
                    placeholder="Contoh: Tukang AC, Desain Grafis"
                    defaultValue={userProfile.specialization}
                />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="bio">Tentang Saya (Bio)</Label>
                <Textarea
                id="bio"
                rows={5}
                placeholder="Ceritakan tentang keahlian dan pengalaman Anda..."
                defaultValue={userProfile.bio}
                />
            </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan Profil'}
            </Button>
            </CardFooter>
        </form>
      </Card>

      {/* Bagian Galeri Portofolio */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Portofolio Saya</CardTitle>
            <CardDescription>Pamerkan proyek-proyek yang telah Anda selesaikan.</CardDescription>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Portofolio Baru
          </Button>
        </CardHeader>
        <CardContent>
            {portfolioItems.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {portfolioItems.map((item) => (
                    <div key={item.id} className="group relative">
                        <Image
                        src={item.imageUrl}
                        alt="Foto Portofolio"
                        width={200}
                        height={200}
                        className="h-full w-full rounded-lg object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
                        <Button
                        variant="destructive"
                        size="icon"
                        className="absolute right-2 top-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                        <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-12 text-center">
                    <p className="text-muted-foreground">Anda belum memiliki portofolio.</p>
                    <p className="text-sm text-muted-foreground">Klik tombol "Tambah Portofolio" untuk memulai.</p>
                </div>
            )}
        </CardContent>
      </Card>

       {/* Modal Tambah Portofolio */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleUploadPortfolio}>
                    <DialogHeader>
                        <DialogTitle>Tambah Portofolio Baru</DialogTitle>
                        <DialogDescription>
                            Unggah gambar dan berikan detail singkat tentang proyek Anda.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-6">
                        <div className="space-y-2">
                             <Label htmlFor="portfolio-image" className="sr-only">Foto Proyek</Label>
                             <div className="flex justify-center rounded-lg border border-dashed border-border px-6 py-10">
                                <div className="text-center">
                                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                        <label
                                            htmlFor="portfolio-image"
                                            className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-indigo-500"
                                        >
                                            <span>Unggah sebuah file</span>
                                            <input id="portfolio-image" name="portfolio-image" type="file" className="sr-only" />
                                        </label>
                                        <p className="pl-1">atau seret dan lepas</p>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF hingga 10MB</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="portfolio-title">Judul Pekerjaan</Label>
                            <Input id="portfolio-title" placeholder="Contoh: Renovasi Taman Belakang Rumah" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="portfolio-description">Deskripsi Singkat</Label>
                            <Textarea id="portfolio-description" placeholder="Jelaskan secara singkat apa yang Anda kerjakan." />
                        </div>
                    </div>
                    <DialogFooter>
                         <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isUploading}>
                                Batal
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={isUploading}>
                            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isUploading ? 'Mengunggah...' : 'Unggah Portofolio'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

    </div>
  );
}

