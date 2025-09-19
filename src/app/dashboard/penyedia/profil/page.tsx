
'use client';

import { useState, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';


// Interface untuk data profil
interface Profile {
  nama: string;
  spesialisasi: string;
  bio: string;
  avatarUrl: string;
}

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
  const [profile, setProfile] = useState<Profile>({ nama: '', spesialisasi: '', bio: '', avatarUrl: '' });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

   // Get current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (currentUser) {
        setLoading(true);
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({
            nama: data.nama || '',
            spesialisasi: data.spesialisasi || '',
            bio: data.bio || '',
            avatarUrl: data.photoURL || `https://picsum.photos/seed/${currentUser.uid}/200/200`,
          });
        }
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [currentUser]);


  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsSaving(true);
    const userDocRef = doc(db, 'users', currentUser.uid);

    try {
      await updateDoc(userDocRef, {
        spesialisasi: profile.spesialisasi,
        bio: profile.bio,
      });
      toast({
        title: 'Profil Diperbarui',
        description: 'Perubahan pada profil Anda telah berhasil disimpan.',
      });
    } catch (error) {
      console.error('Error updating profile: ', error);
      toast({
        variant: 'destructive',
        title: 'Gagal Memperbarui Profil',
        description: 'Terjadi kesalahan saat menyimpan data Anda.',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleUploadPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    // Simulasi proses upload
    setTimeout(() => {
        setIsUploading(false);
        setIsModalOpen(false);
         toast({
            title: 'Portofolio Ditambahkan',
            description: 'Item portofolio baru telah berhasil diunggah.',
        });
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
        <form onSubmit={handleProfileUpdate}>
            <CardHeader>
            <CardTitle>Informasi Profil</CardTitle>
            <CardDescription>
                Informasi ini akan ditampilkan kepada calon pelanggan Anda.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            {loading ? (
                <div className="space-y-6">
                    <div className="flex items-center gap-6">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <Skeleton className="h-10 w-28" />
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                         <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24">
                        <AvatarImage src={profile.avatarUrl} alt={profile.nama} />
                        <AvatarFallback>{profile.nama.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Button type="button" variant="outline">
                        <Camera className="mr-2 h-4 w-4" />
                        Ubah Foto
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                        <Label htmlFor="fullName">Nama Lengkap</Label>
                        <Input id="fullName" value={profile.nama} disabled />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="specialization">Spesialisasi</Label>
                        <Input
                            id="specialization"
                            placeholder="Contoh: Tukang AC, Desain Grafis"
                            value={profile.spesialisasi}
                            onChange={(e) => setProfile({...profile, spesialisasi: e.target.value})}
                        />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bio">Tentang Saya (Bio)</Label>
                        <Textarea
                        id="bio"
                        rows={5}
                        placeholder="Ceritakan tentang keahlian dan pengalaman Anda..."
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        />
                    </div>
                </>
            )}
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={isSaving || loading}>
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
