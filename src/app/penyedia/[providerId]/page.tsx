
'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Star, User as UserIcon, Building, Home, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AnimateOnScroll } from '@/components/ui/animate-on-scroll';
import { ChatPanel } from '@/components/chat/ChatPanel';


interface Profile {
  nama: string;
  spesialisasi: string;
  bio: string;
  photoURL: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
}

// Data ulasan statis sebagai placeholder
const staticReviews = [
  {
    id: 1,
    clientName: "Budi S.",
    review: "Pekerjaannya sangat rapi dan cepat. Komunikasinya juga baik, sangat direkomendasikan!",
    rating: 5,
  },
  {
    id: 2,
    clientName: "Ani W.",
    review: "Hasilnya melebihi ekspektasi. Benar-benar profesional dan tahu apa yang harus dilakukan. Terima kasih banyak!",
    rating: 5,
  },
    {
    id: 3,
    clientName: "Rahmat H.",
    review: "Meskipun ada sedikit kendala, masalah cepat teratasi. Overall, pelayanannya memuaskan.",
    rating: 4,
  },
];


export default function ProviderProfilePage({ params }: { params: { providerId: string } }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    const fetchProviderData = async () => {
      if (!params.providerId) {
        setError("Provider ID tidak valid.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 1. Ambil data profil utama
        const profileDocRef = doc(db, 'users', params.providerId);
        const profileDocSnap = await getDoc(profileDocRef);

        if (!profileDocSnap.exists()) {
          setError("Profil penyedia jasa tidak ditemukan.");
          setLoading(false);
          return;
        }
        setProfile(profileDocSnap.data() as Profile);

        // 2. Ambil data portofolio
        const portfolioQuery = query(
          collection(db, 'users', params.providerId, 'portfolioItems'),
          orderBy('createdAt', 'desc')
        );
        const portfolioSnapshot = await getDocs(portfolioQuery);
        const items = portfolioSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PortfolioItem[];
        setPortfolioItems(items);

      } catch (err) {
        console.error("Error fetching provider data:", err);
        setError("Gagal memuat data penyedia jasa.");
      } finally {
        setLoading(false);
      }
    };

    fetchProviderData();
    return () => unsubscribeAuth();
  }, [params.providerId]);
  
  const generateChatId = (uid1: string, uid2: string) => {
    return [uid1, uid2].sort().join('_');
  };


  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-center">
        <div>
          <h2 className="text-2xl font-bold text-destructive">{error}</h2>
          <p className="text-muted-foreground">Silakan periksa kembali tautan yang Anda akses.</p>
           <Button asChild className="mt-4">
            <a href="/">Kembali ke Beranda</a>
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <>
    <div className="bg-secondary">
      <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-12">
            {/* --- Bagian Header Profil --- */}
            <AnimateOnScroll animationClassName="animate-in fade-in slide-in-from-bottom-12 duration-700">
            <Card className="overflow-hidden">
                <div className="relative h-40 bg-muted">
                    {/* Placeholder for a banner image */}
                </div>
                <CardContent className="p-6 text-center -mt-16">
                    <Avatar className="mx-auto h-32 w-32 border-4 border-background">
                        <AvatarImage src={profile.photoURL} alt={profile.nama} />
                        <AvatarFallback>{profile.nama.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight">{profile.nama}</h1>
                    <p className="text-primary font-medium">{profile.spesialisasi || 'Spesialisasi belum diatur'}</p>
                    <div className="mt-2 flex items-center justify-center gap-2 text-muted-foreground">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-lg">4.9</span>
                        <span>(15 Ulasan)</span>
                    </div>
                     <div className="mt-4">
                        <Button onClick={() => setIsChatOpen(true)} disabled={!currentUser || currentUser.uid === params.providerId}>
                            <MessageSquare className="mr-2 h-4 w-4" /> Hubungi Saya
                        </Button>
                    </div>
                </CardContent>
            </Card>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                 {/* --- Kolom Kiri: Tentang & Statistik --- */}
                <div className="lg:col-span-1 space-y-8">
                    <AnimateOnScroll animationClassName="animate-in fade-in slide-in-from-left-12 duration-700 delay-100">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tentang Saya</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                {profile.bio || 'Penyedia jasa ini belum menambahkan bio.'}
                            </p>
                        </CardContent>
                    </Card>
                     </AnimateOnScroll>

                     <AnimateOnScroll animationClassName="animate-in fade-in slide-in-from-left-12 duration-700 delay-200">
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistik</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex items-center">
                                <Home className="h-5 w-5 text-primary mr-3"/>
                                <span className="text-sm">Bergabung sejak 2023</span>
                            </div>
                            <div className="flex items-center">
                                <Building className="h-5 w-5 text-primary mr-3"/>
                                <span className="text-sm">50+ Proyek Selesai</span>
                            </div>
                        </CardContent>
                    </Card>
                    </AnimateOnScroll>
                </div>


                {/* --- Kolom Kanan: Portofolio & Ulasan --- */}
                <div className="lg:col-span-2 space-y-8">
                    {/* --- Bagian Portofolio --- */}
                    <AnimateOnScroll animationClassName="animate-in fade-in slide-in-from-right-12 duration-700 delay-300">
                        <Card>
                            <CardHeader>
                                <CardTitle>Galeri Portofolio</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 pt-6">
                            {portfolioItems.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {portfolioItems.map((item) => (
                                    <div key={item.id} className="group relative overflow-hidden rounded-lg">
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.title}
                                        width={400}
                                        height={300}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-4">
                                        <h3 className="font-semibold text-white">{item.title}</h3>
                                    </div>
                                    </div>
                                ))}
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground py-10">
                                Penyedia jasa ini belum menambahkan portofolio.
                                </div>
                            )}
                            </CardContent>
                        </Card>
                    </AnimateOnScroll>
                    

                     {/* --- Bagian Ulasan --- */}
                    <AnimateOnScroll animationClassName="animate-in fade-in slide-in-from-right-12 duration-700 delay-400">
                        <Card>
                            <CardHeader>
                                <CardTitle>Ulasan Klien</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {staticReviews.map((review, index) => (
                                <div key={review.id}>
                                    <div className="flex items-start gap-4">
                                        <Avatar>
                                            <AvatarFallback>{review.clientName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold">{review.clientName}</p>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                         <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                    {[...Array(5 - review.rating)].map((_, i) => (
                                                        <Star key={i} className="h-4 w-4 text-muted-foreground/50" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="mt-1 text-sm text-muted-foreground">"{review.review}"</p>
                                        </div>
                                    </div>
                                    {index < staticReviews.length - 1 && <Separator className="mt-6" />}
                                </div>
                                ))}
                            </CardContent>
                        </Card>
                    </AnimateOnScroll>

                </div>
            </div>

        </div>
      </div>
    </div>
    {currentUser && profile && (
        <ChatPanel
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            chatId={generateChatId(currentUser.uid, params.providerId)}
            currentUserId={currentUser.uid}
            recipient={{
                id: params.providerId,
                name: profile.nama,
                avatarUrl: profile.photoURL,
            }}
        />
    )}
    </>
  );
}
