import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Search,
  CheckCircle,
  ShieldCheck,
  Star,
  Users,
  Wallet,
} from 'lucide-react';

const steps = [
  {
    icon: <Search className="h-10 w-10 text-primary" />,
    title: 'Cari & Pilih Jasa',
    description: 'Jelajahi ribuan layanan dan pilih yang paling sesuai dengan kebutuhan Anda.',
  },
  {
    icon: <CheckCircle className="h-10 w-10 text-primary" />,
    title: 'Deal & Kerjakan',
    description: 'Hubungi penyedia jasa, sepakati detailnya, dan biarkan pekerjaan dimulai.',
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: 'Selesai & Aman',
    description: 'Pekerjaan selesai dengan baik dan pembayaran Anda aman bersama kami.',
  },
];

const services = [
  { id: 'service-1', name: 'Servis AC', imageHint: 'air conditioner repair' },
  { id: 'service-2', name: 'Tukang Kebun', imageHint: 'gardener working' },
  { id: 'service-3', name: 'Guru Les Privat', imageHint: 'private tutor teaching' },
  { id: 'service-4', name: 'Desain Grafis', imageHint: 'graphic designer workspace' },
  { id: 'service-5', name: 'Fotografer', imageHint: 'photographer camera' },
  { id: 'service-6', name: 'Jasa Angkut', imageHint: 'moving truck' },
];

const testimonials = [
  {
    name: 'Budi Santoso',
    title: 'Pemilik Rumah',
    quote: 'Servis AC jadi cepat dan adem lagi! Penyedia jasanya profesional dan ramah. KelarApp benar-benar membantu.',
    avatar: 'https://picsum.photos/seed/avatar1/100/100',
  },
  {
    name: 'Siti Aminah',
    title: 'Mahasiswi',
    quote: 'Dapat guru les privat gitar yang sabar banget. Sekarang sudah mulai bisa main beberapa lagu. Terima kasih Kelar!',
    avatar: 'https://picsum.photos/seed/avatar2/100/100',
  },
  {
    name: 'Rahmat Hidayat',
    title: 'Pengusaha Kafe',
    quote: 'Desain logo untuk kafe saya hasilnya luar biasa. Komunikasinya lancar dan hasilnya melebihi ekspektasi.',
    avatar: 'https://picsum.photos/seed/avatar3/100/100',
  },
];

const features = [
  {
    icon: <Star className="h-10 w-10 text-primary" />,
    title: 'Kualitas Terjamin',
    description: 'Kami hanya bekerja sama dengan penyedia jasa terverifikasi dan bereputasi baik.',
  },
  {
    icon: <Wallet className="h-10 w-10 text-primary" />,
    title: 'Harga Transparan',
    description: 'Tidak ada biaya tersembunyi. Anda tahu apa yang Anda bayar sejak awal.',
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: 'Dukungan Pelanggan',
    description: 'Tim kami siap membantu Anda 24/7 jika Anda mengalami kendala.',
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-landing-2');

  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6 text-center lg:text-left">
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-12 duration-500 delay-100">
              <h1 className="font-headline text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                Selesaikan Semua Urusanmu, <span className="text-primary">Kelar-in Aja!</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                Platform terpadu untuk semua kebutuhan jasa Anda. Dari perbaikan rumah hingga pengembangan skill, temukan profesional terbaik di sini.
              </p>
            </div>
            <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-12 duration-500 delay-200">
              <Button asChild size="lg">
                <Link href="/cari-jasa" className="font-bold">Saya butuh Jasa</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/tawarkan-jasa" className="font-bold">Saya tawarkan Jasa</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center animate-in fade-in zoom-in-90 duration-500 delay-300">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                width={800}
                height={600}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                data-ai-hint={heroImage.imageHint}
              />
            )}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="bg-secondary py-20">
        <div className="container mx-auto px-4 text-center animate-in fade-in slide-in-from-bottom-16 duration-700">
          <h2 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">Cara Kerjanya Mudah</h2>
          <p className="mx-auto mb-12 max-w-2xl text-muted-foreground">Hanya dengan tiga langkah sederhana, masalah Anda langsung beres.</p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center animate-in fade-in slide-in-from-bottom-16 duration-700">
          <h2 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">Layanan Paling Populer</h2>
          <p className="mx-auto mb-12 max-w-2xl text-muted-foreground">Temukan jasa yang paling banyak dicari oleh pengguna kami.</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {services.map((service) => (
              <Card key={service.id} className="group overflow-hidden">
                <CardContent className="p-0">
                  <Image
                    src={`https://picsum.photos/seed/${service.id}/300/200`}
                    alt={service.name}
                    width={300}
                    height={200}
                    className="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={service.imageHint}
                  />
                  <div className="p-4">
                    <h3 className="font-bold">{service.name}</h3>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-secondary py-20">
        <div className="container mx-auto px-4 animate-in fade-in slide-in-from-bottom-16 duration-700">
          <h2 className="mb-2 text-center text-3xl font-bold tracking-tight sm:text-4xl">Apa Kata Mereka?</h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">Cerita sukses dari para pengguna setia KelarApp.</p>
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col items-start gap-4 p-6">
                        <p className="flex-1 italic text-muted-foreground">"{testimonial.quote}"</p>
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold">{testimonial.name}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 animate-in fade-in slide-in-from-bottom-16 duration-700">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Mengapa Memilih KelarApp?</h2>
              <p className="mt-4 text-muted-foreground">Kami memberikan lebih dari sekadar platform. Kami memberikan ketenangan dan jaminan kualitas untuk setiap pekerjaan.</p>
              <div className="mt-8 space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="https://picsum.photos/seed/why-us/600/600"
                alt="Why Choose Us"
                width={600}
                height={600}
                className="rounded-xl object-cover"
                data-ai-hint="person trust handshake"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 py-16 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-3xl font-bold">Punya Keahlian?</h2>
            <p className="mt-2 text-lg text-primary-foreground/90">Jadilah mitra kami dan dapatkan penghasilan tambahan dengan keahlian Anda.</p>
          </div>
          <Button asChild size="lg" variant="secondary" className="flex-shrink-0 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            <Link href="/tawarkan-jasa" className="font-bold">Daftar Jadi Mitra</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
