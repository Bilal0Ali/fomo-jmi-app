"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getDoubts, Doubt } from "@/lib/firestore/doubts";
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
        const fetchedDoubts = await getDoubts();
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
        {/* Content will be rendered here based on loading state and fetched doubts */}
      </CardContent>
    </Card>
  );
