"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Mail } from "lucide-react";

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(false),
  inAppNotifications: z.boolean().default(true),
  DocScribInbox: z.boolean().default(false),
  groupNotifications: z.boolean().default(true),
  warnSessionDeletion: z.boolean().default(false),
});

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

const defaultValues: NotificationsFormValues = {
  emailNotifications: true,
  pushNotifications: false,
  inAppNotifications: true,
  DocScribInbox: false,
  groupNotifications: true,
  warnSessionDeletion: false,
};

export function NotificationsForm() {
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues,
    mode: "onChange"
  });

  function onSubmit(data: NotificationsFormValues) {
    console.log(data);
    // TODO: Implement save functionality
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Main content with 2-column layout for desktop/tablet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notification Methods Section */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Notification methods</CardTitle>
                <CardDescription>
                  Choose how you want to receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="emailNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Email notifications</FormLabel>
                        <FormDescription className="text-xs">
                          Receive notifications via email.
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

                <FormField
                  control={form.control}
                  name="pushNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Push notifications</FormLabel>
                        <FormDescription className="text-xs">
                          Receive push notifications on your device.
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

                <FormField
                  control={form.control}
                  name="inAppNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">In-app notifications</FormLabel>
                        <FormDescription className="text-xs">
                          Receive notifications within the app.
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

                <FormField
                  control={form.control}
                  name="DocScribInbox"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">DocScrib inbox</FormLabel>
                        <FormDescription className="text-xs">
                          Receive notifications in your DocScrib inbox.
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

            {/* Grouping and Urgency Section */}
            <Card>
              <CardHeader>
                <CardTitle>Grouping and urgency</CardTitle>
                <CardDescription>
                  Manage how notifications are grouped and prioritized.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="groupNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Group notifications</FormLabel>
                        <FormDescription className="text-xs">
                          Group similar notifications together and send based on urgency.
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

            {/* Notification Types Section */}
            <Card>
              <CardHeader>
                <CardTitle>Notification types</CardTitle>
                <CardDescription>
                  Select the types of notifications you want to receive.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="warnSessionDeletion"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Session deletion warnings</FormLabel>
                        <FormDescription className="text-xs">
                          Get notified before a session is deleted. Deletion frequency is based on your{" "}
                          <Link href="/dashboard/pages/settings/data-management" className="text-primary underline">
                            data management settings
                          </Link>.
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

            {/* Interested in other notifications */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Interested in other notifications?</CardTitle>
                <CardDescription>
                  Let us know if you'd like to receive additional types of notifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button type="button" variant="outline" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Let us know
                </Button>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-6" />

          <div className="flex justify-end">
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}