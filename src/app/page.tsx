"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-primary text-accent">
      <div className="animate-fade-in-out text-center">
        <h1 className="text-6xl font-bold tracking-tighter">FOMO</h1>
        <p className="mt-2 text-accent/80">JMI Study Hub</p>
      </div>
    </div>
  );
}
