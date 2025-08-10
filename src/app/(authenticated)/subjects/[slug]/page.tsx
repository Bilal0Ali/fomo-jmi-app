
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadResourceDialog } from "@/components/dashboard/upload-resource-dialog";

function toTitleCase(str: string) {
  if (!str) return '';
  return str.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1));
}

export default function SubjectPage({ params }: { params: { slug: string } }) {
  const subjectName = toTitleCase(params?.slug || '');

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
            </CrdContent>
          </Card>
        </TabsContent>
        <TabsContent value="doubts">
          <Card>
            <CardHeader>
              <CardTitle>Doubts</CardTitle>
              <CardDescription>All doubts for {subjectName}.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Doubts for {subjectName} will be here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
