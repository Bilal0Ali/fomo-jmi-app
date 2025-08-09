import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ResourcesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Resources</CardTitle>
        <CardDescription>Find and filter resources like books, links, and papers.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">Resources section is under construction.</p>
        </div>
      </CardContent>
    </Card>
  );
}
