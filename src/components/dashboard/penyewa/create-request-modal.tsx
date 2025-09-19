
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
import { Camera } from 'lucide-react';
import React from 'react';

type CreateRequestModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateRequestModal({ children, isOpen, onOpenChange }: CreateRequestModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] grid-rows-[auto_1fr_auto] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Buat Permintaan Jasa Baru</DialogTitle>
          <DialogDescription>
            Isi detail di bawah ini untuk menemukan penyedia jasa yang tepat.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto p-1 -mx-1 pr-3">
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Judul Pekerjaan
                </Label>
                <Input id="title" placeholder="Contoh: Perbaikan AC bocor" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Kategori Jasa
                </Label>
                <Select>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="tukang">Jasa Tukang</SelectItem>
                        <SelectItem value="kebersihan">Jasa Kebersihan</SelectItem>
                        <SelectItem value="masak">Jasa Masak</SelectItem>
                        <SelectItem value="desain">Desain & Kreatif</SelectItem>
                        <SelectItem value="privat">Les Privat</SelectItem>
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
                />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="budget" className="text-right">
                  Anggaran (Rp)
                </Label>
                <Input id="budget" type="number" placeholder="500000" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                 <Label htmlFor="photos" className="text-right pt-2">
                  Foto Referensi
                </Label>
                <div className="col-span-3">
                     <div
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-secondary hover:bg-muted"
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Camera className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground">
                                <span className="font-semibold">Klik untuk unggah</span> atau seret foto
                            </p>
                            <p className="text-xs text-muted-foreground">PNG, JPG, atau GIF (maks. 5MB)</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Unggah foto (opsional) untuk memberikan gambaran yang lebih jelas.</p>
                </div>
              </div>
            </div>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline">
                    Batal
                </Button>
            </DialogClose>
          <Button type="submit">Kirim Permintaan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
