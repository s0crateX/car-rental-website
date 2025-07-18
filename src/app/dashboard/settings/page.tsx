import { GeneralSettingsForm } from "@/components/forms/general-settings-form";
import { PasswordSettingsForm } from "@/components/forms/password-settings-form";
import { ProfilePictureForm } from "@/components/forms/profile-picture-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
        <Tabs defaultValue="general" className="w-full">
        <TabsList>
          <TabsTrigger value="general">General Info</TabsTrigger>
          <TabsTrigger value="picture">Profile Picture</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <GeneralSettingsForm />
        </TabsContent>
        <TabsContent value="picture">
          <ProfilePictureForm />
        </TabsContent>
        <TabsContent value="password">
          <PasswordSettingsForm />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}