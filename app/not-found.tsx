'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  const redirectBack = () => {
    try {
      window.history.back();
    } catch (error) {
      // Si hay algún error o no hay página anterior, redirigir al inicio
      router.push('/');
    }
  };

  const redirectHome = () => {
    router.push('/');
  };

  return (
    <main className="flex h-dvh w-full flex-1 items-center justify-center p-6">
      <section className="bg-opacity-10 isolate max-w-xl flex-1 space-y-4 rounded-lg border bg-transparent bg-clip-padding p-8 text-center ring-1 ring-black/5 backdrop-blur-2xl backdrop-filter">
        <h1 className="text-3xl font-bold">Not Found</h1>
        <p className="text-zinc-400">
          please, we are currently unable to find the requested page. We offer you the following options to visit.
        </p>
        <div className="space-x-6 pt-4">
          <Button variant="link" onClick={redirectBack}>
            Go Back
          </Button>
          <Button variant="outline" onClick={redirectHome}>
            Go to Home
          </Button>
        </div>
      </section>
    </main>
  );
}
