
'use client';

import { useState, useEffect } from 'react';
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
import { PlusCircle, MoreVertical, Edit, Trash2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PortfolioModal } from '@/components/dashboard/penyedia/portfolio-modal';
import { auth, db, storage } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, onSnapshot, orderBy, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  filePath: string;
  createdAt: Timestamp;
}

export default function PortfolioPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<PortfolioItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'users', currentUser.uid, 'portfolioItems'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PortfolioItem[];
      setPortfolioItems(items);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching portfolio items: ", error);
      setLoading(false);
      toast({
        variant: 'destructive',
        title: 'Gagal Memuat Portofolio',
        description: 'Terjadi kesalahan saat mengambil data portofolio Anda.',
      });
    });

    return () => unsubscribe();
  }, [currentUser, toast]);

  const handleDeletePortfolio = async () => {
    if (!itemToDelete || !currentUser) return;

    setIsDeleting(true);
    try {
      // 1. Hapus Dokumen Firestore
      const docRef = doc(db, 'users', currentUser.uid, 'portfolioItems', itemToDelete.id);
      await deleteDoc(docRef);

      // 2. Hapus File di Storage
      const fileRef = ref(storage, itemToDelete.filePath);
      await deleteObject(fileRef);

      toast({
        title: 'Portofolio Dihapus',
        description: `"${itemToDelete.title}" telah berhasil dihapus.`,
      });

    } catch (error) {
      console.error("Error deleting portfolio item: ", error);
      toast({
        variant: 'destructive',
        title: 'Gagal Menghapus',
        description: 'Terjadi kesalahan saat mencoba menghapus item portofolio.',
      });
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };


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
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : portfolioItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioItems.map((item) => (
            <Card key={item.id} className="flex flex-col">
              <CardHeader className="p-0">
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
              <CardContent className="flex-1 space-y-2 p-4">
                <Badge variant="secondary">{item.category}</Badge>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between items-center p-4">
                 <p className="text-sm text-muted-foreground">
                    Dibuat: {item.createdAt ? new Date(item.createdAt.toDate()).toLocaleDateString('id-ID') : 'N/A'}
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => setItemToDelete(item)}>
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

       {/* Alert Dialog for Deletion */}
        <AlertDialog open={itemToDelete !== null} onOpenChange={(open) => !open && setItemToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                    Tindakan ini tidak dapat dibatalkan. Ini akan menghapus item portofolio secara permanen dari server kami.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setItemToDelete(null)} disabled={isDeleting}>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeletePortfolio} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                    {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    </div>
  );
}

    