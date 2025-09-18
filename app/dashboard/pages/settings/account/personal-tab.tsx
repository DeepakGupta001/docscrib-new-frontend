"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { SearchableCountryDropdown } from "@/components/country-dropdown";
import { useAuth } from "@/lib/hooks/use-auth";
import { toast } from "sonner";

type AccountFormValues = {
    title?: string;
    firstName: string;
    lastName: string;
    specialty?: string;
    organisationName?: string;
    companySize?: string;
    role?: string;
    country: string;
};

interface PersonalTabProps {
    form: ReturnType<typeof useForm<AccountFormValues>>;
    onSubmit: (data: AccountFormValues) => void;
    user?: {
        firstName?: string;
        lastName?: string;
        picture?: string;
    } | null;
    isSubmitting?: boolean;
}

export function PersonalTab({ form, onSubmit, user, isSubmitting = false }: PersonalTabProps) {
    const { uploadProfileImage, user: authUser } = useAuth();
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Please select a valid image file (JPG, PNG, or GIF)');
            return;
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            toast.error('File size must be less than 5MB');
            return;
        }

        setIsUploadingImage(true);
        try {
            const imageUrl = await uploadProfileImage(file);
            toast.success('Profile image uploaded successfully!');
            console.log('New profile image URL:', imageUrl);
        } catch (error: any) {
            toast.error(error.message || 'Failed to upload profile image');
        } finally {
            setIsUploadingImage(false);
            // Clear the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                    Update your personal details and profile information
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Profile Image */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border">
                    <Avatar className="h-16 w-16">
                        <AvatarImage
                            src={user?.profileImageUrl ? `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${user.profileImageUrl}` : ""}
                            alt="Profile"
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {(user?.firstName || form.watch('firstName'))?.[0]}{(user?.lastName || form.watch('lastName'))?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="font-medium">Profile image</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Upload a JPG or PNG image up to 5MB. Shows in the template community.
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 gap-2"
                            onClick={handleFileSelect}
                            disabled={isUploadingImage}
                        >
                            <Upload className="h-4 w-4" />
                            {isUploadingImage ? "Uploading..." : "Upload image"}
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Title + First + Last in one row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Title */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a title" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Dr">Dr</SelectItem>
                                                <SelectItem value="Mr">Mr</SelectItem>
                                                <SelectItem value="Mrs">Mrs</SelectItem>
                                                <SelectItem value="Ms">Ms</SelectItem>
                                                <SelectItem value="Prof">Prof</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* First Name */}
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Last Name */}
                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Specialty + Organisation + Company Size + Role */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="specialty"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Specialty</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select your specialty" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                                                <SelectItem value="Family Medicine">Family Medicine</SelectItem>
                                                <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                                                <SelectItem value="Cardiology">Cardiology</SelectItem>
                                                <SelectItem value="Dermatology">Dermatology</SelectItem>
                                                <SelectItem value="Emergency Medicine">Emergency Medicine</SelectItem>
                                                <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                                                <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                                                <SelectItem value="Radiology">Radiology</SelectItem>
                                                <SelectItem value="Surgery">Surgery</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="organisationName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Organisation name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
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
                                        <FormLabel>Company size</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select company size" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="1">1</SelectItem>
                                                <SelectItem value="2-5">2-5</SelectItem>
                                                <SelectItem value="6-10">6-10</SelectItem>
                                                <SelectItem value="11-50">11-50</SelectItem>
                                                <SelectItem value="51-200">51-200</SelectItem>
                                                <SelectItem value="201+">201+</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Your role</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select your role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Individual clinician">Individual clinician</SelectItem>
                                                <SelectItem value="Clinical lead, department lead, head of …">Clinical lead, department lead, head of …</SelectItem>
                                                <SelectItem value="Executive team (CIO, CMIO, CEO etc.)">Executive team (CIO, CMIO, CEO etc.)</SelectItem>
                                                <SelectItem value="Owner or practice manager">Owner or practice manager</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Country Dropdown */}
                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <SearchableCountryDropdown
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            placeholder="Select your country..."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Why can't I change this?{" "}
                                        <Link href="#" className="text-primary hover:underline">
                                            Privacy Policy for my country
                                        </Link>
                                    </p>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={isSubmitting || !form.formState.isDirty}
                            >
                                {isSubmitting ? "Updating..." : "Update profile"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
