
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export default function RegistrasiPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Buat Akun Baru</CardTitle>
            <CardDescription>
              Sudah punya akun?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Masuk di sini
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="full-name">Nama Lengkap</Label>
                  <Input id="full-name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="space-y-2">
                  <Label>Saya ingin mendaftar sebagai:</Label>
                  <RadioGroup required className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                          <RadioGroupItem value="penyewa" id="role-penyewa" />
                          <Label htmlFor="role-penyewa">Penyewa Jasa</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                          <RadioGroupItem value="penyedia" id="role-penyedia" />
                          <Label htmlFor="role-penyedia">Penyedia Jasa</Label>
                      </div>
                  </RadioGroup>
              </div>
              <div className="flex items-start space-x-2 pt-2">
                  <Checkbox id="terms" required />
                  <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground"
                  >
                  Saya setuju dengan{' '}
                  <Link href="#" className="font-medium text-primary hover:underline">
                      Syarat & Ketentuan
                  </Link>{' '}
                  dan{' '}
                  <Link href="#" className="font-medium text-primary hover:underline">
                      Kebijakan Privasi
                  </Link>
                  .
                  </label>
              </div>
              <Button type="submit" className="w-full font-bold">
                Daftar
              </Button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Atau lanjut dengan
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-full font-bold">Daftar dengan Google</Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
