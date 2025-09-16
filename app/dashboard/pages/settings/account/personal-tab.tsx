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
import { useState } from "react";
import { SearchableCountryDropdown } from "@/components/country-dropdown";

const accountFormSchema = z.object({
    title: z.string().optional(),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    specialty: z.string().optional(),
    organisationName: z.string().optional(),
    companySize: z.string().optional(),
    role: z.string().optional(),
    country: z.string().min(1, "Country is required"),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

interface PersonalTabProps {
    form: ReturnType<typeof useForm<AccountFormValues>>;
    onSubmit: (data: AccountFormValues) => void;
}

export function PersonalTab({ form, onSubmit }: PersonalTabProps) {
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
                        <AvatarImage src="" alt="Profile" />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {form.watch('firstName')?.[0]}{form.watch('lastName')?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="font-medium">Profile image</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Upload a JPG or PNG image up to 5MB. Shows in the template community.
                        </p>
                        <Button variant="outline" size="sm" className="mt-3 gap-2">
                            <Upload className="h-4 w-4" />
                            Upload image
                        </Button>
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
                                            defaultValue={field.value}
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
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
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
                                            defaultValue={field.value}
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
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
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

                        <Button type="submit">Update profile</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}