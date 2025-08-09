"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { AskDoubtDialog } from '@/components/dashboard/ask-doubt-dialog';
import { useSearchParams } from 'next/navigation'
import { Suspense } from "react";

const subjects = [
  "International Trade",
  "Indian Economic Policy",
  "Statistical Data Analysis & Software",
  "Applied Predictive Modelling",
];

function HomeContent() {
  const searchParams = useSearchParams();
  const userName = searchParams.get('name') || "Ayesha";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Hi, {userName} 👋</h1>
        <p className="text-muted-foreground">Welcome back. What will you learn today?</p>
      </div>

      <AskDoubtDialog />

      <div>
        <h2 className="mb-4 text-2xl font-semibold">Your Subjects</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {subjects.map((subject) => (
            <Link href={`/subjects/${subject.toLowerCase().replace(/[ &]/g, '-')}`} key={subject}>
                <Card className="hover:border-accent hover:shadow-lg transition-all cursor-pointer h-full flex flex-col">
                    <CardHeader>
                        <CardTitle>{subject}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>View notes, resources, and doubts for this subject.</CardDescription>
                    </CardContent>
                </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  )
}
