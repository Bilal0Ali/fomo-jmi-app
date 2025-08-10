
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud } from 'lucide-react';
import { auth, storage } from '@/lib/firebase';
import { Progress } from '@/components/ui/progress';
import { UploadTaskSnapshot, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UploadResourceDialogProps {
  subject: string;
  type: 'Notes' | 'Resources';
}

export function UploadResourceDialog({ subject, type }: UploadResourceDialogProps) {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
      setIsUploading(false);
      setIsSaving(false);
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
    setIsUploading(true);
  
    const filePath = `user-uploads/${user.uid}/${Date.now()}-${fileToUpload.name}`;
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

    uploadTask.on('state_changed',
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        toast({
          title: "Upload Failed",
          description: "Could not upload the file. Please try again.",
          variant: "destructive",
        });
        setUploadProgress(0);
        setIsUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setDownloadURL(downloadUrl);
            toast({
                title: "File Ready!",
                description: "Your file has been uploaded. Add a title and submit.",
            });
            setIsUploading(false);
        });
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

  setIsSaving(true);

  try {
    // Use the createResource utility function
    const resourceData = {
      fileName: title,
      fileType: file?.type || 'N/A', // Get file type from the state
      fileUrl: downloadURL,
      uploadedBy: user.uid,
      uploadedByName: user.displayName || 'Anonymous',
      subject: subject,
      category: type,
      uploadedAt: serverTimestamp(),
    };
    await addDoc(collection(db, "resources"), resourceData);

    toast({
      title: "Upload Successful!",
      description: `Your ${type} has been saved successfully.`,
    });
    setOpen(false);
  } catch (error) {
    console.error("Error saving resource:", error);
    toast({
      title: "Submission Failed",
      description: "Could not save the resource details. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsSaving(false);
  }
};

  
  const getButtonText = () => {
    if (isSaving) return 'Saving...';
    if (isUploading) return 'Uploading...';
    return 'Upload';
  }

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
                {(isUploading || uploadProgress > 0) && (
                    <div className="grid grid-cols-4 items-center gap-4">
                        <div className="col-start-2 col-span-3">
                            <Progress value={uploadProgress} className="w-full" />
                            <p className="text-xs text-muted-foreground mt-1 text-center">{uploadProgress < 100 ? `${Math.round(uploadProgress)}% uploaded` : 'Upload complete!'}</p>
                        </div>
                    </div>
                )}
            </div>
            <DialogFooter>
            <Button type="submit" disabled={isUploading || isSaving || !downloadURL} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {getButtonText()}
            </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
