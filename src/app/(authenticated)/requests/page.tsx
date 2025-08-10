
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAllDoubts, Doubt } from "@/lib/firestore/doubts";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function RequestsPage() {
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoubts = async () => {
      try {
        setLoading(true);
        const fetchedDoubts = await getAllDoubts();
        setDoubts(fetchedDoubts);
      } catch (err) {
        console.error("Error fetching doubts:", err);
        setError("Failed to load doubts.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoubts();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Requests & Doubts</CardTitle>
        <CardDescription>Manage your requests and help your peers.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-destructive">{error}</p>
          </div>
        ) : doubts.length === 0 ? (
          <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No doubts have been posted yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {doubts.map((doubt) => (
              <div key={doubt.id} className="border p-4 rounded-md">
                <p className="font-semibold">{doubt.questionText}</p>
                <p className="text-sm text-muted-foreground">Subject: {doubt.subject}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
