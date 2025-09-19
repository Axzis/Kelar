
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
import { ArrowLeft, Calendar, Tag, Star, User, DollarSign, Loader2, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, onSnapshot, collection, query, writeBatch, Timestamp, addDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { format, fromUnixTime } from 'date-fns';
import { id } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { ChatPanel } from '@/components/chat/ChatPanel';


// Interface untuk data pekerjaan
interface Job {
  id: string;
  title: string;
  category: string;
  status: 'SELESAI' | 'DALAM PENGERJAAN' | 'MENUNGGU PEMBAYARAN' | 'DIBATALKAN' | 'OPEN';
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  budget: number;
  description: string;
  photoUrl?: string;
  providerId?: string;
  providerName?: string;
}

// Interface untuk data penawaran
interface Bid {
  id: string; // Ini adalah ID dokumen bid, yang juga merupakan providerId
  providerName: string;
  providerRating: number;
  providerAvatarUrl: string;
  reviews: number; 
}


// Objek untuk memetakan status pekerjaan ke varian warna Badge
const statusVariant: { [key in Job['status']]: "default" | "secondary" | "destructive" | "outline" } = {
  'SELESAI': 'default',
  'DALAM PENGERJAAN': 'secondary',
  'MENUNGGU PEMBAYARAN': 'outline',
  'DIBATALKAN': 'destructive',
  'OPEN': 'secondary',
};

// Objek untuk memetakan status pekerjaan ke teks yang lebih ramah pengguna
const statusDisplay: { [key in Job['status']]: string } = {
    'SELESAI': 'Selesai',
    'DALAM PENGERJAAN': 'Dalam Pengerjaan',
    'MENUNGGU PEMBAYARAN': 'Menunggu Pembayaran',
    'DIBATALKAN': 'Dibatalkan',
    'OPEN': 'Mencari Penyedia',
};


export default function JobDetailPage() {
  const [jobDetails, setJobDetails] = useState<Job | null>(null);
  const [bidders, setBidders] = useState<Bid[]>([]);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [biddersLoading, setBiddersLoading] = useState(true);
  const [acceptingBid, setAcceptingBid] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeRecipient, setActiveRecipient] = useState<Bid | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const jobId = params.jobId as string;
  
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribeAuth;
  }, []);


  useEffect(() => {
    if (jobId) {
      const jobDocRef = doc(db, 'jobs', jobId);
      
      const unsubscribeJob = onSnapshot(jobDocRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setJobDetails({ 
            id: doc.id,
            ...data,
           } as Job);
        } else {
          console.error("No such document!");
          setJobDetails(null);
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching job details: ", error);
        setLoading(false);
      });

      // Query ke sub-koleksi bids
      const bidsQuery = query(collection(db, 'jobs', jobId, 'bids'));
      const unsubscribeBids = onSnapshot(bidsQuery, (querySnapshot) => {
        const bidsData = querySnapshot.docs.map(doc => ({
            id: doc.id, // ID dokumen bid ini adalah ID dari provider
            ...doc.data()
        })) as Bid[];
        setBidders(bidsData);
        setBiddersLoading(false);
      }, (error) => {
        console.error("Error fetching bidders: ", error);
        setBiddersLoading(false);
      });


      // Cleanup listener saat komponen unmount
      return () => {
        unsubscribeJob();
        unsubscribeBids();
      }
    }
  }, [jobId]);

  const handleAcceptBid = async (bidder: Bid) => {
    if (!jobDetails || !bidders.length) return;
    setAcceptingBid(bidder.id);

    try {
        const batch = writeBatch(db);

        // 1. Update dokumen pekerjaan utama
        const jobRef = doc(db, 'jobs', jobDetails.id);
        batch.update(jobRef, {
            status: 'DALAM PENGERJAAN',
            providerId: bidder.id, // ID penawar
            providerName: bidder.providerName,
        });

        // 2. Update semua dokumen di sub-koleksi 'bids'
        bidders.forEach(b => {
            const bidRef = doc(db, 'jobs', jobDetails.id, 'bids', b.id);
            if (b.id === bidder.id) {
                batch.update(bidRef, { status: 'ACCEPTED' });
            } else {
                batch.update(bidRef, { status: 'REJECTED' });
            }
        });

        // 3. Buat notifikasi untuk penyedia jasa yang menang
        await addDoc(collection(db, 'notifications'), {
            userId: bidder.id, // ID penyedia jasa yang menang
            message: `Selamat! Tawaran Anda untuk pekerjaan "${jobDetails.title}" telah diterima.`,
            linkTo: `/dashboard/penyedia/tawaran`,
            isRead: false,
            createdAt: Timestamp.now(),
        });


        // Commit batch
        await batch.commit();

        toast({
            title: 'Tawaran Diterima!',
            description: `Anda telah memilih ${bidder.providerName} untuk mengerjakan proyek ini.`,
        });

    } catch (error) {
        console.error("Error accepting bid: ", error);
        toast({
            variant: 'destructive',
            title: 'Gagal Menerima Tawaran',
            description: 'Terjadi kesalahan saat memproses permintaan Anda.'
        });
    } finally {
        setAcceptingBid(null);
    }
  };

  const openChatWith = (recipient: Bid) => {
    setActiveRecipient(recipient);
    setIsChatOpen(true);
  };
  
  const generateChatId = (uid1: string, uid2: string) => {
    return [uid1, uid2].sort().join('_');
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!jobDetails) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold">Pekerjaan tidak ditemukan</h2>
        <p className="text-muted-foreground">Pekerjaan yang Anda cari mungkin telah dihapus atau tidak ada.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/penyewa/pekerjaan">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Pekerjaan
          </Link>
        </Button>
      </div>
    );
  }
  
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
                        Dibuat pada {jobDetails.createdAt ? format(fromUnixTime(jobDetails.createdAt.seconds), 'd MMMM yyyy', { locale: id }) : '-'}
                    </span>
                     <span className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Anggaran: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(jobDetails.budget)}
                    </span>
                </CardDescription>
            </div>
            <Badge variant={statusVariant[jobDetails.status] || 'default'}>
              {statusDisplay[jobDetails.status] || 'Status Tidak Diketahui'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
            <Separator className="my-4" />
            <h3 className="text-lg font-semibold mb-2">Deskripsi Lengkap</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{jobDetails.description}</p>
        </CardContent>
      </Card>

      {/* Daftar Penawar */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">
          {jobDetails.status === 'OPEN' ? `Daftar Penawar (${bidders.length})` : 'Penyedia Jasa Terpilih'}
        </h2>
         {biddersLoading ? (
            <Card>
                <CardContent className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        ) : (jobDetails.status === 'DALAM PENGERJAAN' || jobDetails.status === 'SELESAI') && jobDetails.providerId ? (
             <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                     <Avatar className="h-16 w-16">
                        <AvatarImage src={`https://picsum.photos/seed/${jobDetails.providerId}/100/100`} />
                        <AvatarFallback>{jobDetails.providerName?.charAt(0) ?? 'P'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>{jobDetails.providerName}</CardTitle>
                        <CardDescription>Penyedia jasa yang sedang mengerjakan atau telah menyelesaikan pekerjaan ini.</CardDescription>
                    </div>
                    </div>
                </CardHeader>
                 <CardFooter>
                    <Button onClick={() => openChatWith({ 
                        id: jobDetails.providerId!, 
                        providerName: jobDetails.providerName!, 
                        providerAvatarUrl: `https://picsum.photos/seed/${jobDetails.providerId}/100/100`,
                        providerRating: 0,
                        reviews: 0,
                    })}>
                        <MessageSquare className="mr-2 h-4 w-4" /> Hubungi
                    </Button>
                </CardFooter>
            </Card>
        ) : bidders.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bidders.map((bidder) => (
                <Card key={bidder.id} className="flex flex-col">
                <CardHeader className="flex-1">
                    <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={bidder.providerAvatarUrl} alt={bidder.providerName} />
                        <AvatarFallback>{bidder.providerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle>{bidder.providerName}</CardTitle>
                        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{bidder.providerRating}</span>
                        <span>({bidder.reviews || 0} ulasan)</span>
                        </div>
                    </div>
                    </div>
                </CardHeader>
                <CardFooter className="flex flex-col items-stretch gap-2">
                     <Button 
                        className="w-full" 
                        onClick={() => handleAcceptBid(bidder)} 
                        disabled={acceptingBid !== null || jobDetails.status !== 'OPEN'}
                    >
                        {acceptingBid === bidder.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Terima Tawaran'}
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" className="w-full" asChild disabled={acceptingBid !== null}>
                        <Link href={`/penyedia/${bidder.id}`}>
                            <User className="mr-2 h-4 w-4" />
                            Profil
                        </Link>
                        </Button>
                         <Button variant="secondary" className="w-full" onClick={() => openChatWith(bidder)} disabled={acceptingBid !== null}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Hubungi
                        </Button>
                    </div>
                </CardFooter>
                </Card>
            ))}
            </div>
        ) : (
            <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                Belum ada penyedia jasa yang memberikan penawaran untuk pekerjaan ini.
                </CardContent>
            </Card>
        )}
      </div>

       {currentUser && activeRecipient && (
            <ChatPanel 
                isOpen={isChatOpen} 
                onClose={() => setIsChatOpen(false)} 
                chatId={generateChatId(currentUser.uid, activeRecipient.id)}
                currentUserId={currentUser.uid}
                recipient={{
                    id: activeRecipient.id,
                    name: activeRecipient.providerName,
                    avatarUrl: activeRecipient.providerAvatarUrl,
                }}
            />
       )}
    </div>
  );
}

    
