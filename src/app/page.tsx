import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-landing');

  return (
    <section className="container mx-auto px-4 py-16 sm:py-24 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="space-y-6 text-center lg:text-left">
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-12 duration-500 delay-100">
            <h1 className="font-headline text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              Semua Urusan Pasti <span className="text-primary">Kelar</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Temukan jasa profesional untuk segala kebutuhan Anda. Cepat, mudah, dan terpercaya. Mulai dari perbaikan rumah hingga les privat, semua ada di sini.
            </p>
          </div>
          <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center lg:justify-start animate-in fade-in slide-in-from-bottom-12 duration-500 delay-200">
            <Button asChild size="lg">
              <Link href="/cari-jasa">Saya butuh Jasa</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/tawarkan-jasa">Saya tawarkan Jasa</Link>
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
  );
}
