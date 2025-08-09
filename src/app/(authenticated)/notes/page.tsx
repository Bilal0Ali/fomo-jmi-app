import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function NotesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Notes</CardTitle>
        <CardDescription>Find and filter notes from all your subjects.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">Notes section is under construction.</p>
        </div>
      </CardContent>
    </Card>
  );
}
