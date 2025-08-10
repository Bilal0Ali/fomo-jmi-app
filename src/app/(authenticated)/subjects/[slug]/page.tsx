import { useState, useEffect } from 'react';
import { queryDoubtsBySubject, Doubt } from "@/lib/firestore/doubts";
import { auth } from "@/lib/firebase"; // Import auth to get current user UID

"use client";

import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadResourceDialog } from "@/components/dashboard/upload-resource-dialog";

function toTitleCase(str: string) {
  if (!str) return '';
  return str.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1));
}

export default function SubjectPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const subjectName = toTitleCase(slug);

  if (!subjectName) {
    return <div>Loading subject...</div>;
  }
const [doubts, setDoubts] = useState<Doubt[]>([]);
const [loadingDoubts, setLoadingDoubts] = useState(true);
useEffect(() => {
  const fetchDoubts = async () => {
    setLoadingDoubts(true);
    if (subjectName) {
      try {
        const subjectDoubts = await queryDoubtsBySubject(subjectName);
        setDoubts(subjectDoubts);
      } catch (error) {
        console.error("Error fetching subject doubts:", error);
        // Optionally show a toast or error message
      }
    }
    setLoadingDoubts(false);
  };

  fetchDoubts();
}, [subjectName]); // Rerun when subjectName changes

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{subjectName}</h1>
        <p className="text-muted-foreground">Notes, resources, and doubts for this subject.</p>
      </div>
      <Tabs defaultValue="notes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:inline-flex">
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="doubts">Doubts</TabsTrigger>
        </TabsList>
        <TabsContent value="notes">
          <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Notes</CardTitle>
                    <UploadResourceDialog subject={subjectName} type="Notes" />
                </div>
              <CardDescription>All notes for {subjectName}.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Notes for {subjectName} will be here.</p>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Resources</CardTitle>
                <UploadResourceDialog subject={subjectName} type="Resources" />
              </div>
              <CardDescription>All resources for {subjectName}.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Resources for {subjectName} will be here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="doubts">
  <Card>
    <CardHeader>
      <CardTitle>Doubts</CardTitle>
      <CardDescription>All doubts for {subjectName}.</CardDescription>
    </CardHeader>
    <CardContent>
      {loadingDoubts ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-muted-foreground">Loading doubts...</p>
        </div>
      ) : doubts.length === 0 ? (
        <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No doubts posted for {subjectName} yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {doubts.map((doubt) => (
            <div key={doubt.id} className="border p-4 rounded-md">
              <p className="font-semibold">{doubt.questionText}</p>
              {/* You might want to fetch the asker's name using doubt.askedBy */}
              <p className="text-sm text-muted-foreground">Asked by: {doubt.askedBy}</p>
              {/* Display answers here later */}
            </div>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
</TabsContent>

      </Tabs>
    </div>
  );
}
