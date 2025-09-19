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
import { ExternalLink, MessageSquare } from "lucide-react";

const labsFormSchema = z.object({
  optInBeta: z.boolean().default(false),
});

type LabsFormValues = z.infer<typeof labsFormSchema>;

const defaultValues: LabsFormValues = {
  optInBeta: false,
};

export function LabsForm() {
  const form = useForm<LabsFormValues>({
    resolver: zodResolver(labsFormSchema),
    defaultValues,
    mode: "onChange"
  });

  function onSubmit(data: LabsFormValues) {
    console.log(data);
    // TODO: Implement save functionality
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Docscrib Labs Section */}
          <Card>
            <CardHeader>
              <CardTitle>DocScrib Labs</CardTitle>
              <CardDescription>
                Opt-in to selective beta features and get early access to upcoming features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-sm text-muted-foreground">
                Get early access to upcoming features and help shape the future of Docscrib.
              </div>

              <FormField
                control={form.control}
                name="optInBeta"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Opt-in to selective beta features</FormLabel>
                      <FormDescription>
                        Enable access to experimental features that are in development.
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

              <Separator />

              <div className="flex flex-col sm:flex-row gap-4">
                <Button type="button" variant="outline" className="flex items-center gap-2" asChild>
                  <Link href="/learn-more-heidi-labs">
                    <ExternalLink className="h-4 w-4" />
                    Learn more about Docscrib Labs
                  </Link>
                </Button>

                <Button type="button" variant="outline" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Provide feedback
                </Button>
              </div>
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
