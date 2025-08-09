"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  course: z.string().nonempty("Please select your course."),
  semester: z.string().nonempty("Please select your semester."),
});

const subjectsBySemester: { [key: string]: string[] } = {
  "1": ["Microeconomics I", "Macroeconomics I", "Mathematical Methods", "Statistics"],
  "2": ["Microeconomics II", "Macroeconomics II", "Econometrics", "Development Economics"],
  "3": [
    "International Trade",
    "Indian Economic Policy",
    "Statistical Data Analysis &amp; Software",
    "Applied Predictive Modelling",
  ],
  "4": ["Public Economics", "Financial Economics", "Environmental Economics", "Dissertation"],
};

export function ProfileSetupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      course: "M.A. Economics", // Defaulted as per spec
      semester: "",
    },
  });

  const selectedSemester = form.watch("semester");

  function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true);
    // Mock API call to save profile data
    setTimeout(() => {
      toast({
        title: "Profile Saved!",
        description: "You're all set. Welcome to the hub!",
      });
      router.push("/home");
      setIsLoading(false);
    }, 1500);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Ayesha Khan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="course"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your course" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="M.A. Economics">M.A. Economics</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="semester"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Semester</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your semester" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Semester 1</SelectItem>
                  <SelectItem value="2">Semester 2</SelectItem>
                  <SelectItem value="3">Semester 3</SelectItem>
                  <SelectItem value="4">Semester 4</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {selectedSemester &amp;&amp; subjectsBySemester[selectedSemester] &amp;&amp; (
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Your Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5">
                {subjectsBySemester[selectedSemester].map(subject => (
                  <li key={subject}>{subject}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <Button 
          type="submit" 
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          disabled={isLoading || !selectedSemester}
        >
          {isLoading ? "Saving..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
}
