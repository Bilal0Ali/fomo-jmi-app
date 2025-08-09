
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud } from 'lucide-react';

interface UploadResourceDialogProps {
  subject: string;
  type: 'Notes' | 'Resources';
}

export function UploadResourceDialog({ subject, type }: UploadResourceDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) {
      toast({
        title: "Missing Fields",
        description: "Please provide a title and select a file.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Mock upload
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log({
      subject,
      type,
      title,
      description,
      fileName: file.name,
      fileSize: file.size,
    });
    
    toast({
      title: "Upload Successful!",
      description: `Your ${type} for ${subject} has been uploaded successfully.`,
    });
    
    setIsLoading(false);
    setOpen(false);
    // Reset form
    setTitle('');
    setDescription('');
    setFile(null);
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
                    <Input id="file" type="file" className="col-span-3" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} required accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg" />
                </div>
            </div>
            <DialogFooter>
            <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {isLoading ? 'Uploading...' : 'Upload'}
            </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

