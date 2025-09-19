import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Languages, Calendar } from "lucide-react";

type AccountFormValues = {
  displayLanguage: string;
  dateFormat: string;
};

interface PreferencesTabProps {
  form: ReturnType<typeof useForm<AccountFormValues>>;
  onSubmit: (data: AccountFormValues) => void;
}

export function PreferencesTab({ form, onSubmit }: PreferencesTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Display Settings</CardTitle>
          <CardDescription>Configure how content appears in your Docscrib interface</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Display Language + Date Format in single row */}
              <div className="flex flex-col gap-8 md:flex-row">
                {/* Display Language Section */}
                <div className="flex flex-1 items-start gap-3">
                  <div className="mt-1 rounded-lg bg-primary/10 p-2">
                    <Languages className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <FormLabel className="text-base font-medium">Display language</FormLabel>
                    <FormDescription>
                      Change the language used in the Docscrib interface.
                    </FormDescription>
                    <FormField
                      control={form.control}
                      name="displayLanguage"
                      render={({ field }) => (
                        <FormItem className="mt-2">
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full md:w-[280px]">
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="English">English</SelectItem>
                              <SelectItem value="Spanish">Spanish</SelectItem>
                              <SelectItem value="French">French</SelectItem>
                              <SelectItem value="German">German</SelectItem>
                              <SelectItem value="Italian">Italian</SelectItem>
                              <SelectItem value="Portuguese">Portuguese</SelectItem>
                              <SelectItem value="Japanese">Japanese</SelectItem>
                              <SelectItem value="Chinese">Chinese</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Date Format Section */}
                <div className="flex flex-1 items-start gap-3">
                  <div className="mt-1 rounded-lg bg-primary/10 p-2">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <FormLabel className="text-base font-medium">Date format</FormLabel>
                    <FormDescription>
                      Choose how dates are displayed throughout the application.
                    </FormDescription>
                    <FormField
                      control={form.control}
                      name="dateFormat"
                      render={({ field }) => (
                        <FormItem className="mt-2">
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full md:w-[280px]">
                                <SelectValue placeholder="Select date format" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="DD/MM/YYYY">
                                DD/MM/YYYY (Day/Month/Year)
                              </SelectItem>
                              <SelectItem value="MM/DD/YYYY">
                                MM/DD/YYYY (Month/Day/Year)
                              </SelectItem>
                              <SelectItem value="YYYY-MM-DD">
                                YYYY-MM-DD (Year-Month-Day)
                              </SelectItem>
                              <SelectItem value="DD MMM YYYY">DD MMM YYYY (01 Jan 2023)</SelectItem>
                              <SelectItem value="MMM DD, YYYY">
                                MMM DD, YYYY (Jan 01, 2023)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={!form.formState.isDirty}>
                  Update preferences
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
