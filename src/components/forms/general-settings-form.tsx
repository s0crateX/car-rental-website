"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { withConfirmation } from "@/components/hoc/with-confirmation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-provider";
import { db } from "@/config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const ConfirmedButton = withConfirmation(Button, {
  title: "Are you sure?",
  description: "This will update your profile information.",
});

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email(),
});

export function GeneralSettingsForm() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          form.reset({
            fullName: userData.fullName || "",
            email: userData.email || "",
          });
        }
      }
    };
    fetchUserData();
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;
    setIsSaving(true);
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, values);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Error updating profile.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Your email address" {...field} readOnly />
              </FormControl>
              <FormDescription>
                Your email address cannot be changed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <ConfirmedButton
          type="button"
          disabled={isSaving}
          onClick={form.handleSubmit(onSubmit)}
        >
          {isSaving ? "Saving..." : "Save changes"}
        </ConfirmedButton>
      </form>
    </Form>
  );
}