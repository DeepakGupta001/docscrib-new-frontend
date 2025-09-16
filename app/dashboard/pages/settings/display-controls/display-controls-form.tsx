"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const displayControlsFormSchema = z.object({
  showConsentPopup: z.boolean().default(false),
  hideEmailInSidebar: z.boolean().default(false),
  defaultTab: z.enum(["note", "context", "transcript"]).default("note"),
  enableSplitView: z.boolean().default(false),
});

type DisplayControlsFormValues = z.infer<typeof displayControlsFormSchema>;

const defaultValues: DisplayControlsFormValues = {
  showConsentPopup: false,
  hideEmailInSidebar: false,
  defaultTab: "note",
  enableSplitView: false,
};

export function DisplayControlsForm() {
  const form = useForm<DisplayControlsFormValues>({
    resolver: zodResolver(displayControlsFormSchema),
    defaultValues,
    mode: "onChange"
  });

  function onSubmit(data: DisplayControlsFormValues) {
    console.log(data);
    // TODO: Implement save functionality
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Security & Compliance Section */}
          <Card>
            <CardHeader>
              <CardTitle>Security & compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="showConsentPopup"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Show consent pop-up</FormLabel>
                      <FormDescription>
                        When this is on, you'll see a pop-up at the beginning of each session reminding you to ask the patient for their consent to record the session.
                      </FormDescription>
                      <Link
                        href="#"
                        className="text-sm text-primary hover:underline"
                      >
                        Learn more about patient consent
                      </Link>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hideEmailInSidebar"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Hide my email address in sidebar</FormLabel>
                      <FormDescription>
                        When this is on, your email address will be hidden from the profile section of the sidebar.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Viewing & Editing Sessions Section */}
          <Card>
            <CardHeader>
              <CardTitle>Viewing & editing sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="defaultTab"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default tab for new sessions</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose which tab should be displayed when starting a new session" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="note">Note</SelectItem>
                        <SelectItem value="context">Context</SelectItem>
                        <SelectItem value="transcript">Transcript</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose which tab should be displayed when starting a new session.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <Separator />

              <FormField
                control={form.control}
                name="enableSplitView"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Open live transcription in split view</FormLabel>
                      <FormDescription>
                        When enabled, your session view will display both live transcription and context. Not available on mobile or tablet.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
