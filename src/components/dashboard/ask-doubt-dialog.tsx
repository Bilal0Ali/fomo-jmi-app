"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PenSquare, Bot, Sparkles, Loader2 } from 'lucide-react';
import { aiDoubtSolver, AiDoubtSolverInput, AiDoubtSolverOutput } from '@/ai/flows/ai-doubt-solver';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const subjects = [
  "International Trade",
  "Indian Economic Policy",
  "Statistical Data Analysis & Software",
  "Applied Predictive Modelling",
  "Microeconomics I", 
  "Macroeconomics I", 
  "Mathematical Methods", 
  "Statistics",
  "Microeconomics II", 
  "Macroeconomics II", 
  "Econometrics", 
  "Development Economics",
  "Public Economics", 
  "Financial Economics", 
  "Environmental Economics", 
  "Dissertation"
];

export function AskDoubtDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AiDoubtSolverOutput | null>(null);
  const [doubtInput, setDoubtInput] = useState<AiDoubtSolverInput>({ doubtText: '', subjectMaterial: '' });
  const { toast } = useToast();

  const handleAiSubmit = async () => {
    if (!doubtInput.doubtText || !doubtInput.subjectMaterial) {
      toast({
        title: "Missing Fields",
        description: "Please select a subject and describe your doubt.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setAiResponse(null);
    try {
      const response = await aiDoubtSolver(doubtInput);
      setAiResponse(response);
    } catch (error) {
      console.error("AI Doubt Solver Error:", error);
      toast({
        title: "AI Error",
        description: "Could not get suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRequest = () => {
    if (!doubtInput.doubtText || !doubtInput.subjectMaterial) {
      toast({
        title: "Missing Fields",
        description: "Please select a subject and describe your doubt before posting.",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Submitting request:", { ...doubtInput, aiSuggestion: aiResponse?.suggestions });
    toast({
      title: "Request Submitted!",
      description: "Your doubt has been posted for your peers.",
    });
    setOpen(false);
    setAiResponse(null);
    setDoubtInput({ doubtText: '', subjectMaterial: '' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
          <PenSquare className="mr-2 h-5 w-5" />
          Ask a Doubt / Request Notes
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ask a new question</DialogTitle>
          <DialogDescription>
            Describe your doubt or what notes you need. You can get instant AI suggestions or post it for your peers.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">Subject</Label>
            <Select onValueChange={(value) => setDoubtInput(prev => ({...prev, subjectMaterial: value}))}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="doubt" className="text-right">Doubt/Request</Label>
            <Textarea 
              id="doubt" 
              placeholder="e.g. Can someone explain the Heckscher-Ohlin model? Provide details about the topic from the textbook for better AI suggestions." 
              className="col-span-3"
              value={doubtInput.doubtText}
              onChange={(e) => setDoubtInput(prev => ({...prev, doubtText: e.target.value}))}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">File</Label>
            <Input id="file" type="file" className="col-span-3" />
          </div>
        </div>

        {aiResponse && (
          <Alert>
            <Bot className="h-4 w-4" />
            <AlertTitle>AI Suggestions</AlertTitle>
            <AlertDescription className="whitespace-pre-wrap">
              {aiResponse.suggestions}
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between gap-2 mt-4">
          <Button onClick={handleAiSubmit} variant="outline" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Get AI Suggestions
          </Button>
          <Button onClick={handleSubmitRequest} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Post to Peers
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
