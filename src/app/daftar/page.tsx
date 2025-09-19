
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
import Link from 'next/link';

export default function DaftarPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Buat Akun Baru</CardTitle>
          <CardDescription>
            Sudah punya akun?{' '}
            <Link href="/masuk" className="font-medium text-primary hover:underline">
              Masuk di sini
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="first-name">Nama Depan</Label>
                    <Input id="first-name" placeholder="John" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="last-name">Nama Belakang</Label>
                    <Input id="last-name" placeholder="Doe" required />
                </div>
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
              <Label htmlFor="confirm-password">Konfirmasi Password</Label>
              <Input id="confirm-password" type="password" required />
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
    </div>
  );
}
