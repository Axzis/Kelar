import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import Link from 'next/link';
import { Search, MapPin, Star } from 'lucide-react';

const services = [
  {
    id: '1',
    name: 'Budi Hartono - Spesialis AC',
    category: 'Servis AC',
    location: 'Jakarta Selatan',
    rating: 4.8,
    reviews: 120,
    price: 'Mulai dari Rp150.000',
    image: 'https://picsum.photos/seed/provider1/400/300',
    imageHint: 'technician smiling'
  },
  {
    id: '2',
    name: 'Siti Gardening - Taman Indah',
    category: 'Tukang Kebun',
    location: 'Bandung',
    rating: 4.9,
    reviews: 85,
    price: 'Nego',
    image: 'https://picsum.photos/seed/provider2/400/300',
    imageHint: 'beautiful garden'
  },
  {
    id: '3',
    name: 'Andi Wijaya - Tutor Cerdas',
    category: 'Guru Les Privat',
    location: 'Surabaya',
    rating: 4.7,
    reviews: 95,
    price: 'Rp200.000/jam',
    image: 'https://picsum.photos/seed/provider3/400/300',
    imageHint: 'teacher classroom'
  },
    {
    id: '4',
    name: 'Creative Studio - Desain Modern',
    category: 'Desain Grafis',
    location: 'Yogyakarta',
    rating: 5.0,
    reviews: 250,
    price: 'Mulai dari Rp500.000/projek',
    image: 'https://picsum.photos/seed/provider4/400/300',
    imageHint: 'designer desk'
  },
  {
    id: '5',
    name: 'Moment Abadi Photography',
    category: 'Fotografer',
    location: 'Bali',
    rating: 4.9,
    reviews: 180,
    price: 'Mulai dari Rp1.500.000/sesi',
    image: 'https://picsum.photos/seed/provider5/400/300',
    imageHint: 'camera lens'
  },
  {
    id: '6',
    name: 'Angkut Cepat Express',
    category: 'Jasa Angkut',
    location: 'Jakarta Pusat',
    rating: 4.6,
    reviews: 70,
    price: 'Tergantung jarak & barang',
    image: 'https://picsum.photos/seed/provider6/400/300',
    imageHint: 'moving boxes'
  },
];

export default function CariJasaPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold">Temukan Jasa yang Anda Butuhkan</h1>
        <p className="text-muted-foreground mt-2">
          Cari penyedia jasa terbaik untuk menyelesaikan semua urusan Anda.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filters */}
        <aside className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filter Pencarian</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="kategori" className="font-medium">
                  Kategori Jasa
                </label>
                <Select>
                  <SelectTrigger id="kategori">
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="servis-ac">Servis AC</SelectItem>
                    <SelectItem value="tukang-kebun">Tukang Kebun</SelectItem>
                    <SelectItem value="guru-les">Guru Les Privat</SelectItem>
                    <SelectItem value="desain-grafis">Desain Grafis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="lokasi" className="font-medium">
                  Lokasi
                </label>
                <Input id="lokasi" placeholder="cth: Jakarta" />
              </div>
              <div className="space-y-2 pt-2">
                 <div className="flex items-center space-x-2">
                    <Checkbox id="terverifikasi" />
                    <label
                    htmlFor="terverifikasi"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                    Penyedia Terverifikasi
                    </label>
                </div>
                 <div className="flex items-center space-x-2">
                    <Checkbox id="rating-tinggi" />
                    <label
                    htmlFor="rating-tinggi"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                    Rating 4.5+
                    </label>
                </div>
              </div>
            </CardContent>
             <CardFooter>
                <Button className="w-full">Terapkan Filter</Button>
            </CardFooter>
          </Card>
        </aside>

        {/* Search Results */}
        <main className="lg:col-span-3">
          <div className="flex items-center mb-6">
            <Input
              placeholder="Cari jasa atau penyedia..."
              className="flex-grow"
            />
            <Button className="ml-2">
              <Search className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden group">
                <div className="relative">
                   <Image
                    src={service.image}
                    alt={service.name}
                    width={400}
                    height={300}
                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={service.imageHint}
                  />
                  <div className="absolute top-2 left-2 bg-primary/80 text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">{service.category}</div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 pt-1">
                    <MapPin className="h-4 w-4" /> {service.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold">{service.rating}</span>
                        <span className="text-sm text-muted-foreground">({service.reviews} ulasan)</span>
                    </div>
                     <p className="font-semibold text-primary">{service.price}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full font-bold">
                    <Link href="#">Lihat Detail</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline">Muat Lebih Banyak</Button>
          </div>
        </main>
      </div>
    </div>
  );
}