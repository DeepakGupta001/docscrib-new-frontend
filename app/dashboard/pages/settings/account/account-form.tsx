"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalTab } from "./personal-tab";
import { LoginTab } from "./login-tab";
import { PreferencesTab } from "./preferences-tab";
import { ReferralTab } from "./referral-tab";



const accountFormSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  specialty: z.string().optional(),
  organisationName: z.string().optional(),
  companySize: z.string().optional(),
  role: z.string().optional(),
  displayLanguage: z.string().default("English"),
  dateFormat: z.string().default("DD/MM/YYYY"),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

// Default values based on the provided data
const defaultValues: Partial<AccountFormValues> = {
  title: "",
  firstName: "manu",
  lastName: "sharma",
  specialty: "Accident and Emergency Nurse",
  organisationName: "jd group",
  companySize: "2-5",
  role: "Clinical lead, department lead, head of …",
  displayLanguage: "English",
  dateFormat: "DD/MM/YYYY",
};

export function AccountForm() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
    mode: "onChange"
  });

  function onSubmit(data: AccountFormValues) {
    console.log(data);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
        <p className="text-sm text-muted-foreground">
          By using Heidi you acknowledge and agree to abide by the{" "}
          <Link href="#" className="text-primary hover:underline">
            Usage Policy
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-primary hover:underline">
            Terms of Use
          </Link>
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="login">Login & Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="referral">Referral</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <PersonalTab form={form} onSubmit={onSubmit} />
        </TabsContent>

        <TabsContent value="login" className="space-y-6">
          <LoginTab />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <PreferencesTab form={form} onSubmit={onSubmit} />
        </TabsContent>

        <TabsContent value="referral" className="space-y-6">
          <ReferralTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
