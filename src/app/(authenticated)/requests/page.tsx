import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function RequestsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Requests &amp; Doubts</CardTitle>
        <CardDescription>Manage your requests and help your peers.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">Requests &amp; Doubts section is under construction.</p>
        </div>
      </CardContent>
    </Card>
  );
}
