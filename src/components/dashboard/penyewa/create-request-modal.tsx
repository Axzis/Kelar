
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
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { auth, db, storage } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged, User } from 'firebase/auth';
import Image from 'next/image';

type CreateRequestModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateRequestModal({ children, isOpen, onOpenChange }: CreateRequestModalProps) {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return () => unsubscribe();
    }, []);
    
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
        setBudget('');
        setPhoto(null);
        setPhotoPreview(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title || !category || !description || !budget) {
            toast({
                variant: 'destructive',
                title: 'Gagal Mengirim',
                description: 'Mohon isi semua kolom yang wajib diisi.',
            });
            return;
        }

        if (!currentUser) {
            toast({
                variant: 'destructive',
                title: 'Gagal Mengirim',
                description: 'Anda harus login untuk membuat permintaan.',
            });
            return;
        }

        setLoading(true);

        try {
            // Fetch user name from Firestore
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            const hirerName = userDoc.exists() ? userDoc.data().nama : 'Pengguna Anonim';
            
            let imageUrl = '';
            if (photo) {
                const storageRef = ref(storage, `job-photos/${currentUser.uid}-${Date.now()}-${photo.name}`);
                const snapshot = await uploadBytes(storageRef, photo);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            // Save job data to Firestore
            await addDoc(collection(db, 'jobs'), {
                title,
                category,
                description,
                budget: Number(budget),
                hirerId: currentUser.uid,
                hirerName,
                status: 'OPEN',
                createdAt: serverTimestamp(),
                photoUrl: imageUrl,
            });

            toast({
                title: 'Permintaan Berhasil Dibuat!',
                description: 'Permintaan jasa Anda telah dikirim dan akan segera dilihat oleh para penyedia.',
            });
            
            resetForm();
            onOpenChange(false); // Close modal

        } catch (error) {
            console.error("Error creating job request:", error);
            toast({
                variant: 'destructive',
                title: 'Terjadi Kesalahan',
                description: 'Tidak dapat mengirim permintaan Anda saat ini. Silakan coba lagi nanti.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                resetForm();
            }
            onOpenChange(open);
        }}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[600px] grid-rows-[auto_1fr_auto] max-h-[90vh]">
            <DialogHeader>
            <DialogTitle className="text-2xl">Buat Permintaan Jasa Baru</DialogTitle>
            <DialogDescription>
                Isi detail di bawah ini untuk menemukan penyedia jasa yang tepat.
            </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} id="job-request-form" className="overflow-y-auto p-1 -mx-1 pr-3">
                <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                        Judul Pekerjaan
                        </Label>
                        <Input id="title" placeholder="Contoh: Perbaikan AC bocor" className="col-span-3" value={title} onChange={(e) => setTitle(e.target.value)} required />
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
                        Deskripsi Lengkap
                        </Label>
                        <Textarea
                        id="description"
                        placeholder="Jelaskan kebutuhan Anda secara detail..."
                        className="col-span-3"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="budget" className="text-right">
                        Anggaran (Rp)
                        </Label>
                        <Input id="budget" type="number" placeholder="500000" className="col-span-3" value={budget} onChange={(e) => setBudget(e.target.value)} required/>
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="photos" className="text-right pt-2">
                        Foto Referensi
                        </Label>
                        <div className="col-span-3">
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-muted"
                            >
                                {photoPreview ? (
                                    <Image src={photoPreview} alt="Pratinjau foto" width={100} height={100} className="h-full w-full object-contain p-2" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Camera className="w-8 h-8 mb-2 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground text-center">
                                            <span className="font-semibold">Klik untuk unggah</span> atau seret foto
                                        </p>
                                        <p className="text-xs text-muted-foreground">PNG atau JPG (maks. 5MB)</p>
                                    </div>
                                )}
                                <input id="dropzone-file" type="file" className="hidden" onChange={handlePhotoChange} accept="image/png, image/jpeg" />
                            </label>
                            <p className="text-xs text-muted-foreground mt-1">Unggah foto (opsional) untuk memberikan gambaran yang lebih jelas.</p>
                        </div>
                    </div>
                </div>
            </form>
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={loading}>
                        Batal
                    </Button>
                </DialogClose>
            <Button type="submit" form="job-request-form" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? 'Mengirim...' : 'Kirim Permintaan'}
            </Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    );
}
