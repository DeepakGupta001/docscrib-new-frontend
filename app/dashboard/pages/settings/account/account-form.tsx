"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalTab } from "./personal-tab";
import { LoginTab } from "./login-tab";
import { PreferencesTab } from "./preferences-tab";
import { ReferralTab } from "./referral-tab";
import { useAuth } from "@/lib/hooks/use-auth";
import { toast } from "sonner";



const personalFormSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  specialty: z.string().optional(),
  organisationName: z.string().optional(),
  companySize: z.string().optional(),
  role: z.string().optional(),
  country: z.string().min(1, "Country is required"),
});

const preferencesFormSchema = z.object({
  displayLanguage: z.string().default("English"),
  dateFormat: z.string().default("DD/MM/YYYY"),
});

type PersonalFormValues = z.infer<typeof personalFormSchema>;
type PreferencesFormValues = z.infer<typeof preferencesFormSchema>;

// Default values - will be populated from user data
const personalDefaultValues: Partial<PersonalFormValues> = {
  title: "",
  firstName: "",
  lastName: "",
  specialty: "",
  organisationName: "",
  companySize: "",
  role: "",
  country: "",
};

const preferencesDefaultValues: Partial<PreferencesFormValues> = {
  displayLanguage: "English",
  dateFormat: "DD/MM/YYYY",
};

// Helper functions to map user data to valid select options
const mapSpecialtyToSelectValue = (specialty?: string) => {
  if (!specialty) return "";
  
  const specialtyOptions = [
    "Internal Medicine", "Family Medicine", "Pediatrics", "Cardiology", 
    "Dermatology", "Emergency Medicine", "Orthopedics", "Psychiatry", 
    "Radiology", "Surgery", "Other"
  ];
  
  // Check for exact match first
  if (specialtyOptions.includes(specialty)) {
    return specialty;
  }
  
  // Check for partial matches or common variations
  const lowerSpecialty = specialty.toLowerCase();
  if (lowerSpecialty.includes("emergency") || lowerSpecialty.includes("accident")) {
    return "Emergency Medicine";
  }
  if (lowerSpecialty.includes("family") || lowerSpecialty.includes("general practice")) {
    return "Family Medicine";
  }
  if (lowerSpecialty.includes("internal")) {
    return "Internal Medicine";
  }
  if (lowerSpecialty.includes("surgery") || lowerSpecialty.includes("surgeon")) {
    return "Surgery";
  }
  if (lowerSpecialty.includes("cardio")) {
    return "Cardiology";
  }
  if (lowerSpecialty.includes("pediatric") || lowerSpecialty.includes("paediatric")) {
    return "Pediatrics";
  }
  
  // If no match found, return "Other"
  return "Other";
};

const mapRoleToSelectValue = (role?: string) => {
  if (!role) return "";
  
  const roleOptions = [
    "Individual clinician",
    "Clinical lead, department lead, head of …",
    "Executive team (CIO, CMIO, CEO etc.)",
    "Owner or practice manager"
  ];
  
  // Check for exact match first
  if (roleOptions.includes(role)) {
    return role;
  }
  
  // Check for partial matches
  const lowerRole = role.toLowerCase();
  if (lowerRole.includes("individual") || lowerRole.includes("clinician")) {
    return "Individual clinician";
  }
  if (lowerRole.includes("lead") || lowerRole.includes("head") || lowerRole.includes("department")) {
    return "Clinical lead, department lead, head of …";
  }
  if (lowerRole.includes("executive") || lowerRole.includes("cio") || lowerRole.includes("ceo") || lowerRole.includes("cmio")) {
    return "Executive team (CIO, CMIO, CEO etc.)";
  }
  if (lowerRole.includes("owner") || lowerRole.includes("manager") || lowerRole.includes("practice")) {
    return "Owner or practice manager";
  }
  
  // Default to individual clinician if no match
  return "Individual clinician";
};

const mapTitleToSelectValue = (title?: string) => {
  if (!title) return "";

  const titleOptions = ["Dr", "Mr", "Mrs", "Ms", "Prof"];

  // Clean the title by removing periods and extra spaces
  const cleanTitle = title.trim().replace(/\.$/, "");

  // Check for exact match first
  if (titleOptions.includes(cleanTitle)) {
    return cleanTitle;
  }

  // Check for common variations
  const lowerTitle = cleanTitle.toLowerCase();
  if (lowerTitle.includes("doctor") || lowerTitle.includes("dr")) {
    return "Dr";
  }
  if (lowerTitle.includes("professor") || lowerTitle.includes("prof")) {
    return "Prof";
  }
  if (lowerTitle.includes("mister") || lowerTitle.includes("mr")) {
    return "Mr";
  }
  if (lowerTitle.includes("mrs")) {
    return "Mrs";
  }
  if (lowerTitle.includes("miss") || lowerTitle.includes("ms")) {
    return "Ms";
  }

  return "";
};

export function AccountForm() {
  const { user, isLoading, updateUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const personalForm = useForm<PersonalFormValues>({
    resolver: zodResolver(personalFormSchema),
    defaultValues: personalDefaultValues,
    mode: "onChange"
  });

  const preferencesForm = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: preferencesDefaultValues,
    mode: "onChange"
  });

  // Populate personal form with user data when available
  useEffect(() => {
    if (user && !isLoading) {
      const mappedTitle = mapTitleToSelectValue(user.title);
      const mappedSpecialty = mapSpecialtyToSelectValue(user.specialization);
      const mappedRole = mapRoleToSelectValue(user.role);

      const formData = {
        title: mappedTitle,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        specialty: mappedSpecialty,
        organisationName: user.organisationName || "",
        companySize: user.companySize || "",
        role: mappedRole,
        country: user.country || "",
      };

      // Use setTimeout to ensure form reset happens after render cycle
      setTimeout(() => {
        personalForm.reset(formData);
      }, 0);
    }
  }, [user, isLoading, personalForm]);

  async function onPersonalSubmit(data: PersonalFormValues) {
    setIsSubmitting(true);
    try {
      await updateUser({
        firstName: data.firstName,
        lastName: data.lastName,
        title: data.title,
        specialization: data.specialty,
        organisationName: data.organisationName,
        companySize: data.companySize,
        country: data.country,
        role: data.role,
      });
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onPreferencesSubmit(data: PreferencesFormValues) {
    // Handle preferences update - this could be a separate API call
    toast.success("Preferences updated successfully!");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="login">Login & Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="referral" disabled>Referral</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <PersonalTab form={personalForm} onSubmit={onPersonalSubmit} user={user} isSubmitting={isSubmitting} />
        </TabsContent>

        <TabsContent value="login" className="space-y-6">
          <LoginTab />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <PreferencesTab form={preferencesForm} onSubmit={onPreferencesSubmit} />
        </TabsContent>

        <TabsContent value="referral" className="space-y-6">
          <ReferralTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
