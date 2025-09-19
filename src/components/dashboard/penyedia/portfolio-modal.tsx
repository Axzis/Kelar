
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

type PortfolioModalProps = {
  children?: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  // portfolioItem?: any; // Untuk mode edit
};

export function PortfolioModal({ children, isOpen, onOpenChange }: PortfolioModalProps) {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setTitle('');
        setCategory('');
        setDescription('');
        setPhoto(null);
        setPhotoPreview(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        // TODO: Ganti dengan logika simpan ke Firestore
        console.log({ title, category, description, photo });

        // Simulasi proses async
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast({
            title: 'Portofolio Ditambahkan!',
            description: 'Item baru telah berhasil ditambahkan ke portofolio Anda.',
        });
        
        setLoading(false);
        resetForm();
        onOpenChange(false); // Tutup modal
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) resetForm();
            onOpenChange(open);
        }}>
        {children && <DialogTrigger asChild>{children}</DialogTrigger>}
        <DialogContent className="sm:max-w-[600px] grid-rows-[auto_1fr_auto] max-h-[90vh]">
            <DialogHeader>
                <DialogTitle className="text-2xl">Tambah Item Portofolio</DialogTitle>
                <DialogDescription>
                    Isi detail proyek yang telah Anda selesaikan.
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} id="portfolio-form" className="overflow-y-auto p-1 -mx-1 pr-3">
                <div className="grid gap-6 py-4">
                     <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="photos" className="text-right pt-2">
                        Foto Proyek
                        </Label>
                        <div className="col-span-3">
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-muted"
                            >
                                {photoPreview ? (
                                    <Image src={photoPreview} alt="Pratinjau foto" layout="fill" objectFit="contain" className="p-2 rounded-lg" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Camera className="w-8 h-8 mb-2 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground text-center">
                                            <span className="font-semibold">Klik untuk unggah</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">PNG atau JPG (maks. 5MB)</p>
                                    </div>
                                )}
                                <input id="dropzone-file" type="file" className="hidden" onChange={handlePhotoChange} accept="image/png, image/jpeg" required />
                            </label>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                        Judul Proyek
                        </Label>
                        <Input id="title" placeholder="Contoh: Renovasi Dapur Modern" className="col-span-3" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                        Kategori Jasa
                        </Label>
                        <Select value={category} onValueChange={setCategory} required>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Jasa Tukang">Jasa Tukang</SelectItem>
                                <SelectItem value="Jasa Kebersihan">Jasa Kebersihan</SelectItem>
                                <SelectItem value="Jasa Angkut">Jasa Angkut</SelectItem>
                                <SelectItem value="Desain & Kreatif">Desain & Kreatif</SelectItem>
                                <SelectItem value="Les Privat">Les Privat</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="description" className="text-right pt-2">
                        Deskripsi Proyek
                        </Label>
                        <Textarea
                        id="description"
                        placeholder="Jelaskan pekerjaan yang Anda lakukan pada proyek ini..."
                        className="col-span-3"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        />
                    </div>
                </div>
            </form>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={loading}>
                        Batal
                    </Button>
                </DialogClose>
                <Button type="submit" form="portfolio-form" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {loading ? 'Menyimpan...' : 'Simpan Portofolio'}
                </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    );
}

