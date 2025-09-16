"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const dataManagementFormSchema = z.object({
  autoDeleteEnabled: z.boolean().default(false),
  autoDeleteDays: z.number().min(1).max(90).optional(),
  enableDictationPlayback: z.boolean().default(false),
});

type DataManagementFormValues = z.infer<typeof dataManagementFormSchema>;

const defaultValues: DataManagementFormValues = {
  autoDeleteEnabled: false,
  autoDeleteDays: 30,
  enableDictationPlayback: false,
};

export function DataManagementForm() {
  const form = useForm<DataManagementFormValues>({
    resolver: zodResolver(dataManagementFormSchema),
    defaultValues,
    mode: "onChange"
  });

  const autoDeleteEnabled = form.watch("autoDeleteEnabled");

  function onSubmit(data: DataManagementFormValues) {
    console.log(data);
    // TODO: Implement save functionality
  }

  function handleDeleteAllSessions() {
    // TODO: Implement delete all sessions functionality
    console.log("Delete all sessions");
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Data Retention Section */}
          <Card>
            <CardHeader>
              <CardTitle>Data retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="autoDeleteEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Automatically delete sessions</FormLabel>
                      <FormDescription>
                        Schedule sessions to delete on a recurring basis (between 1 to 90 days).
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

              {autoDeleteEnabled && (
                <FormField
                  control={form.control}
                  name="autoDeleteDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delete sessions after (days)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={90}
                          placeholder="30"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                        />
                      </FormControl>
                      <FormDescription>
                        Sessions will be automatically deleted after this many days.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {/* Privacy & Recording Section */}
          <Card>
            <CardHeader>
              <CardTitle>Privacy & recording</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="enableDictationPlayback"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable dictation playback</FormLabel>
                      <FormDescription>
                        Opting in will store recordings of your dictations. This allows you or your staff to play back and verify the accuracy of dictations. You must get consent to record patients speaking.
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

          {/* Danger Zone Section */}
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger zone
              </CardTitle>
              <CardDescription>
                Permanently delete all sessions on your account, and all transcripts, notes and documents associated with these sessions.
              </CardDescription>
            </CardHeader>
            <CardContent>

              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteAllSessions}
              >
                Delete all sessions
              </Button>
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
