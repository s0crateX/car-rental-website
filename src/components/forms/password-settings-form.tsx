"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { withConfirmation } from "@/components/hoc/with-confirmation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-provider";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useState } from "react";
import { toast } from "sonner";

const ConfirmedButton = withConfirmation(Button, {
  title: "Are you sure?",
  description: "This will update your password. This action is irreversible.",
});

const formSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required." }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export function PasswordSettingsForm() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;

    setIsSaving(true);
    setError(null);

    try {
      const credential = EmailAuthProvider.credential(user.email!, values.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, values.newPassword);
      toast.success("Password updated successfully!");
      form.reset();
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        toast.error("The current password you entered is incorrect. Please try again.");
      } else {
        toast.error("Error updating password.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        <ConfirmedButton type="submit" disabled={isSaving} onClick={form.handleSubmit(onSubmit)}>
          {isSaving ? "Saving..." : "Update Password"}
        </ConfirmedButton>
      </form>
    </Form>
  );
}