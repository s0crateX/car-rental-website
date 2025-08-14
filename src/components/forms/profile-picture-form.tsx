"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-provider";
import { db } from "@/config/firebase";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { withConfirmation } from "@/components/hoc/with-confirmation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const ConfirmedButton = withConfirmation(Button, {
  title: "Are you sure?",
  description: "This will upload a new profile picture and replace your current one.",
});

export function ProfilePictureForm() {
  const { user } = useAuth();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);


  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        setProfileImageUrl(doc.data().profileImageUrl || null);
      }
    }, (error) => {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data.");
    });

    return () => unsubscribe();
  }, [user]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && user) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      setIsUploading(true);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { profileImageUrl: data.url });
        setProfileImageUrl(data.url);
        toast.success("Profile picture updated successfully!");
      }
 catch (error) {
        toast.error("Error uploading file.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profileImageUrl || ""} alt="User's profile picture" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-medium">Profile Picture</h3>
          <p className="text-sm text-muted-foreground">
            Upload a new profile picture.
          </p>
        </div>
      </div>

      <Input type="file" onChange={handleFileChange} disabled={isUploading} className="hidden" />

      <Button onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload Image"}
      </Button>
    </div>
  );
}