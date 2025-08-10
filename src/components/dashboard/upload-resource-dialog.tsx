
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud } from 'lucide-react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, UploadTaskSnapshot } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Progress } from '@/components/ui/progress';

interface UploadResourceDialogProps {
  subject: string;
  type: 'Notes' | 'Resources';
}

export function UploadResourceDialog({ subject, type }: UploadResourceDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Reset state when dialog is closed or opened
    if (!open) {
      setTitle('');
      setDescription('');
      setFile(null);
      setUploadProgress(0);
      setDownloadURL(null);
      setIsSubmitting(false);
    }
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
        setFile(selectedFile);
        handleUpload(selectedFile);
    }
  }

  const handleUpload = (fileToUpload: File) => {
    const user = auth.currentUser;
    if (!user || !fileToUpload) return;

    setUploadProgress(0);
    setDownloadURL(null);

    const storage = getStorage();
    const uniqueFileName = `${Date.now()}-${fileToUpload.name}`;
    const storageRef = ref(storage, `resources/${user.uid}/${uniqueFileName}`);
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

    uploadTask.on('state_changed',
        (snapshot: UploadTaskSnapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
        },
        (error) => {
            console.error("Upload error in progress:", error);
            toast({
                title: "Upload Failed",
                description: "Could not upload the file. Please try again.",
                variant: "destructive",
            });
            setUploadProgress(0); // Reset on error
        },
        async () => {
            try {
                const url = await getDownloadURL(uploadTask.snapshot.ref);
                setDownloadURL(url);
                toast({
                    title: "File Ready!",
                    description: "Your file has been uploaded. Add a title and submit.",
                });
            } catch (error) {
                 console.error("Could not get download URL:", error);
                 toast({
                    title: "Upload Failed",
                    description: "Could not process the uploaded file. Please try again.",
                    variant: "destructive",
                });
            }
        }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
        toast({ title: "Authentication Error", description: "You must be logged in to upload.", variant: "destructive" });
        return;
    }
    if (!title || !downloadURL) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and ensure the file is uploaded.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
        await addDoc(collection(db, 'resources'), {
            fileName: title,
            fileUrl: downloadURL,
            originalFileName: file?.name || 'N/A',
            uploadedBy: user.uid,
            uploadedByName: user.displayName || "Anonymous",
            uploadedAt: serverTimestamp(),
            subject: subject,
            description: description,
            type: type
        });

        toast({
            title: "Upload Successful!",
            description: `Your ${type} has been saved successfully.`,
        });
        setOpen(false); // Close dialog on success
    } catch (error) {
        console.error("Firestore error:", error);
        toast({
            title: "Submission Failed",
            description: "Could not save the resource details. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  };
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
            <UploadCloud className="mr-2" />
            Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
            <DialogHeader>
            <DialogTitle>Upload {type}</DialogTitle>
            <DialogDescription>
                Share your materials with your peers. Fill out the details below.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-6">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subject" className="text-right">Subject</Label>
                    <Input id="subject" value={subject} disabled className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">Type</Label>
                    <Input id="type" value={type} disabled className="col-span-3" />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">Title</Label>
                    <Input id="title" placeholder="e.g. Chapter 5 Summary" className="col-span-3" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Textarea id="description" placeholder="A short description of the content (optional)" className="col-span-3" value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="file" className="text-right">File</Label>
                    <Input id="file" type="file" className="col-span-3" onChange={handleFileChange} required accept=".pdf" />
                </div>
                {uploadProgress > 0 && (
                    <div className="col-span-4 px-1">
                        <Progress value={uploadProgress} className="w-full" />
                        <p className="text-xs text-muted-foreground mt-1 text-center">{Math.round(uploadProgress)}% uploaded</p>
                    </div>
                )}
            </div>
            <DialogFooter>
            <Button type="submit" disabled={!downloadURL || isSubmitting} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {isSubmitting ? 'Uploading...' : 'Upload'}
            </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
