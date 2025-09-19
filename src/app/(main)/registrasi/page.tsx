
import { Suspense } from 'react';
import { RegistrasiForm } from '@/components/auth/RegistrasiForm';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Komponen Fallback untuk ditampilkan selama Suspense
function LoadingFallback() {
    return (
        <div className="flex flex-1 items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md">
                <CardContent className="flex justify-center items-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        </div>
    );
}

export default function RegistrasiPage() {
  return (
      <Suspense fallback={<LoadingFallback />}>
        <RegistrasiForm />
      </Suspense>
  );
}
