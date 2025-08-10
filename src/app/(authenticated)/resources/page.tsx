
"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Resource {
    id: string;
    fileName: string;
    fileUrl: string;
    subject: string;
    uploadedByName: string;
    uploadedAt: Timestamp;
}

export default function ResourcesPage() {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResources = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, "resources"), orderBy("uploadedAt", "desc"));
                const querySnapshot = await getDocs(q);
                const resourcesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Resource[];
                setResources(resourcesData);
            } catch (error) {
                console.error("Error fetching resources:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResources();
    }, []);

    const formatDate = (timestamp: Timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>All Resources</CardTitle>
                <CardDescription>Find and filter resources like books, links, and papers.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <p className="text-muted-foreground">Loading resources...</p>
                    </div>
                ) : resources.length === 0 ? (
                    <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">No resources have been uploaded yet.</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Subject</TableHead>
                                <TableHead>Uploaded By</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {resources.map((resource) => (
                                <TableRow key={resource.id}>
                                    <TableCell className="font-medium">{resource.fileName}</TableCell>
                                    <TableCell><Badge variant="secondary">{resource.subject}</Badge></TableCell>
                                    <TableCell>{resource.uploadedByName}</TableCell>
                                    <TableCell>{formatDate(resource.uploadedAt)}</TableCell>
                                    <TableCell className="text-right">
                                        <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="icon">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </a>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
