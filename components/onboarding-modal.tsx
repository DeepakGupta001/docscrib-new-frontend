"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { authApi } from "@/lib/api";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const onboardingSchema = z.object({
  specialty: z.string().min(1, "Please select your specialty"),
  role: z.string().min(1, "Please select your role"),
  organisationName: z.string().min(1, "Organization name is required"),
  companySize: z.string().min(1, "Please select company size"),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const specialties = [
  "Internal Medicine",
  "Family Medicine",
  "Pediatrics",
  "Cardiology",
  "Dermatology",
  "Emergency Medicine",
  "Orthopedics",
  "Psychiatry",
  "Radiology",
  "Surgery",
  "Other",
];

const roles = [
  "Individual clinician",
  "Clinical lead, department lead, head of …",
  "Executive team (CIO, CMIO, CEO etc.)",
  "Owner or practice manager",
];

const companySizes = [
  "1",
  "2-5",
  "6-10",
  "11-50",
  "51-200",
  "201+",
];

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    mode: "onChange", // validate only after user changes input
    defaultValues: {
      specialty: "",
      role: "",
      organisationName: "",
      companySize: "",
    },
  });

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: OnboardingFormValues) => {
    // Validate all fields before submission
    const isValid = await form.trigger();
    if (!isValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // Save the data to the backend
      await authApi.completeOnboarding({
        specialization: data.specialty,
        role: data.role,
        organisation_name: data.organisationName,
        company_size: data.companySize,
      });

      toast.success("Welcome! Your profile has been set up successfully.", {
        description: "You can update these details anytime in your account settings.",
      });

      onClose();
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error("Failed to save your information. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await form.trigger("specialty");
      if (isValid) {
        nextStep();
      }
    } else if (currentStep === 2) {
      const isValid = await form.trigger("role");
      if (isValid) {
        nextStep();
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">What is your specialty?</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(val)}
                    value={field.value}
                    defaultValue=""
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select your specialty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">What is your role?</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(val)}
                    value={field.value}
                    defaultValue=""
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="organisationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Organization name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your organization name"
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Company size</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(val)}
                    value={field.value}
                    defaultValue=""
                  >
                    <FormControl>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companySizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]  [&>button]:hidden ">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Welcome to DocScrib! 🎉
          </DialogTitle>
          <DialogDescription className="">
            Let's set up your profile to get you started
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? "Saving..." : "Complete Setup"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
