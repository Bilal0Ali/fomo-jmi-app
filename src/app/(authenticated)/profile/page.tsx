
"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Edit, Save, LogOut, Shield, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ChangePasswordDialog } from "@/components/profile/change-password-dialog";
import { ImageCropperDialog } from "@/components/profile/image-cropper-dialog";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("Ayesha Khan");
  const [email, setEmail] = useState("ayesha.khan@st.jmi.ac.in");
  const [course, setCourse] = useState("M.A. Economics");
  const [semester, setSemester] = useState("3");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [cropperOpen, setCropperOpen] = useState(false);

  useEffect(() => {
    const storedFullName = localStorage.getItem('userFullName');
    if (storedFullName) {
      setName(storedFullName);
    }
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);


  const handleSave = () => {
    // In a real app, you would save this to a backend.
    localStorage.setItem('userFullName', name);
    localStorage.setItem('userName', name.split(' ')[0]);
    if (profilePic) {
      localStorage.setItem('userProfilePic', profilePic);
    }
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem('userName');
    localStorage.removeItem('userFullName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userProfilePic');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push('/login');
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1) {
      return parts[0][0] + parts[parts.length - 1][0];
    }
    return name.slice(0, 2);
  };
  
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
        setCropperOpen(true);
      }
      reader.readAsDataURL(file);
    }
  }


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and settings.</p>
        </div>
        <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
            {isEditing ? <Save className="mr-2"/> : <Edit className="mr-2"/>}
            {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      <ImageCropperDialog 
        image={imageToCrop}
        open={cropperOpen}
        onOpenChange={setCropperOpen}
        onCropComplete={(croppedImage) => {
          setProfilePic(croppedImage);
          setCropperOpen(false);
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>This is your personal information. Your email is verified and cannot be changed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
                <div className="relative">
                    <Avatar className="h-24 w-24 border-2 border-primary">
                        <AvatarImage src={profilePic || undefined} alt="Profile picture" />
                        <AvatarFallback className="text-2xl">{getInitials(name)}</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                        <Button asChild size="icon" className="absolute bottom-0 right-0 rounded-full">
                            <Label htmlFor="profile-pic-upload">
                                <Upload />
                                <span className="sr-only">Upload</span>
                                <Input id="profile-pic-upload" type="file" className="sr-only" onChange={onFileChange} accept="image/*" />
                            </Label>
                        </Button>
                    )}
                </div>
                <div className="grid flex-1 gap-4 md:grid-cols-2">
                    <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditing} />
                    </div>
                     <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" value={email} disabled />
                    </div>
                    <div>
                        <Label htmlFor="course">Course</Label>
                        <Select value={course} onValueChange={setCourse} disabled={!isEditing || true}>
                            <SelectTrigger id="course">
                                <SelectValue placeholder="Select your course" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="M.A. Economics">M.A. Economics</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <Label htmlFor="semester">Semester</Label>
                        <Select value={semester} onValueChange={setSemester} disabled={!isEditing}>
                            <SelectTrigger id="semester">
                                <SelectValue placeholder="Select your semester" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Semester 1</SelectItem>
                                <SelectItem value="2">Semester 2</SelectItem>
                                <SelectItem value="3">Semester 3</SelectItem>
                                <SelectItem value="4">Semester 4</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>My Activity</CardTitle>
            <CardDescription>An overview of your contributions and history on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="my-requests" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                    <TabsTrigger value="my-notes">My Notes</TabsTrigger>
                    <TabsTrigger value="my-resources">My Resources</TabsTrigger>
                    <TabsTrigger value="my-requests">My Requests</TabsTrigger>
                    <TabsTrigger value="my-contributions">My Contributions</TabsTrigger>
                </TabsList>
                <TabsContent value="my-notes">
                    <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg mt-4">
                        <p className="text-muted-foreground">You haven't uploaded any notes yet.</p>
                    </div>
                </TabsContent>
                <TabsContent value="my-resources">
                    <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg mt-4">
                        <p className="text-muted-foreground">You haven't uploaded any resources yet.</p>
                    </div>
                </TabsContent>
                <TabsContent value="my-requests">
                    <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg mt-4">
                        <p className="text-muted-foreground">You haven't made any requests yet.</p>
                    </div>
                </TabsContent>
                <TabsContent value="my-contributions">
                    <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg mt-4">
                        <p className="text-muted-foreground">You haven't contributed to any requests yet.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Manage your account preferences and security.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-4">
                    <Bell className="text-muted-foreground" />
                    <div>
                        <h4 className="font-semibold">Notification Preferences</h4>
                        <p className="text-sm text-muted-foreground">Enable or disable email/push notifications.</p>
                    </div>
                </div>
                <Switch />
            </div>
             <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-4">
                    <Shield className="text-muted-foreground" />
                    <div>
                        <h4 className="font-semibold">Account Privacy</h4>
                        <p className="text-sm text-muted-foreground">Hide your uploads from public search.</p>
                    </div>
                </div>
                <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex flex-col sm:flex-row gap-4">
                <ChangePasswordDialog />
                <Button variant="destructive" className="sm:ml-auto" onClick={handleLogout}>
                    <LogOut className="mr-2"/> Logout
                </Button>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
