"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const defaultsFormSchema = z.object({
  defaultInputLanguage: z.string().default("English"),
  spelling: z.string().default("American"),
  defaultOutputLanguage: z.string().default("English"),
  referToPatient: z.string().default(""),
  referToClinician: z.string().default(""),
  defaultScribe: z.string().default("Free"),
  defaultNoteTemplate: z.string().default("None"),
  defaultStyleDetail: z.string().default("Medium"),
  defaultStyleBulletPoints: z.boolean().default(false),
  defaultStyleQuotes: z.boolean().default(false),
  defaultStyleAbbreviations: z.boolean().default(false),
  echoSuppression: z.boolean().default(true),
  autoCreateTasks: z.boolean().default(false),
  autoOpenSidePanel: z.string().default("Do not auto-open"),
  defaultExportEmail: z.string().email().optional(),
});

type DefaultsFormValues = z.infer<typeof defaultsFormSchema>;

const defaultValues: Partial<DefaultsFormValues> = {
  defaultInputLanguage: "English",
  spelling: "American",
  defaultOutputLanguage: "English",
  referToPatient: "",
  referToClinician: "",
  defaultScribe: "Free",
  defaultNoteTemplate: "None",
  defaultStyleDetail: "Medium",
  defaultStyleBulletPoints: false,
  defaultStyleQuotes: false,
  defaultStyleAbbreviations: false,
  echoSuppression: true,
  autoCreateTasks: false,
  autoOpenSidePanel: "Do not auto-open",
  defaultExportEmail: "",
};

export function DefaultsForm() {
  const form = useForm<DefaultsFormValues>({
    resolver: zodResolver(defaultsFormSchema),
    defaultValues,
    mode: "onChange"
  });

  function onSubmit(data: DefaultsFormValues) {
    console.log(data);
    // TODO: Implement save functionality
  }

  function onReset() {
    form.reset(defaultValues);
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Section */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language & Spelling - 2 Column Layout */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Language & spelling</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="defaultInputLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Default input language</FormLabel>
                        <FormDescription className="text-xs">
                          Heidi can listen for up to 3 languages when transcribing
                        </FormDescription>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Spanish">Spanish</SelectItem>
                            <SelectItem value="French">French</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="spelling"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Spelling</FormLabel>
                        <FormDescription className="text-xs">
                          Select a default spelling
                        </FormDescription>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select spelling" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="American">American</SelectItem>
                            <SelectItem value="British">British</SelectItem>
                            <SelectItem value="Australian">Australian</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="defaultOutputLanguage"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-sm font-medium">Default output language</FormLabel>
                        <FormDescription className="text-xs">
                          The language used for notes & documents
                        </FormDescription>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Spanish">Spanish</SelectItem>
                            <SelectItem value="French">French</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Refer to patient & clinician - 2 Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="referToPatient"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-1">
                        Refer to patient
                        <Badge variant="outline" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                          <span className="text-xs">?</span>
                        </Badge>
                      </FormLabel>
                      <FormDescription className="text-xs">
                        e.g. always refer to the patient by their first name & preferred pronouns
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="Enter patient reference format"
                          className="resize-none mt-2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="referToClinician"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-1">
                        Refer to clinician
                        <Badge variant="outline" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                          <span className="text-xs">?</span>
                        </Badge>
                      </FormLabel>
                      <FormDescription className="text-xs">
                        e.g. use my title, full name & qualifications, Dr John Smith MD
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="Enter clinician reference format"
                          className="resize-none mt-2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Session Defaults */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Session defaults</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Default scribe & note template - 2 Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="defaultScribe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Default scribe</FormLabel>
                      <FormDescription className="text-xs">
                        Choose the scribe that processes your sessions. <span className="text-blue-600 cursor-pointer">Learn more</span>
                      </FormDescription>
                      <div className="mt-3 space-y-2">
                        <div className="p-3 border rounded-lg bg-muted/20 flex justify-between items-center">
                          <div>
                            <p className="font-medium">Free</p>
                            <p className="text-xs text-muted-foreground">Fast for simple sessions</p>
                          </div>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex"
                            >
                              <RadioGroupItem value="Free" id="free" />
                            </RadioGroup>
                          </FormControl>
                        </div>
                        <div className="p-3 border rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-medium">Pro</p>
                            <p className="text-xs text-muted-foreground">Best for complex sessions</p>
                          </div>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex"
                            >
                              <RadioGroupItem value="Pro" id="pro" />
                            </RadioGroup>
                          </FormControl>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="defaultNoteTemplate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Default note template</FormLabel>
                      <FormDescription className="text-xs">
                        The default will automatically generate when you end a session.
                      </FormDescription>
                      <div className="mt-3 p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">None</p>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex"
                            >
                              <RadioGroupItem value="None" id="none" />
                            </RadioGroup>
                          </FormControl>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Default style */}
              <div>
                <FormLabel className="text-sm font-medium">Default style</FormLabel>
                <FormDescription className="text-xs">
                  Your note will automatically be set to this level of detail. You can override it within the session.
                </FormDescription>
                
                <div className="mt-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-medium">Goldilocks</p>
                        <p className="text-xs text-muted-foreground mt-1">Balanced detail for most cases</p>
                      </div>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => form.setValue("defaultStyleDetail", value)}
                          value={form.watch("defaultStyleDetail")}
                          className="flex"
                        >
                          <RadioGroupItem value="Medium" id="goldilocks" />
                        </RadioGroup>
                      </FormControl>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium mb-3">Detail</h4>
                        <FormField
                          control={form.control}
                          name="defaultStyleDetail"
                          render={({ field }) => (
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="space-y-2"
                            >
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem value="Low" id="low" />
                                <Label htmlFor="low" className="text-sm">Low</Label>
                              </div>
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem value="Medium" id="medium" />
                                <Label htmlFor="medium" className="text-sm">Medium</Label>
                              </div>
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem value="High" id="high" />
                                <Label htmlFor="high" className="text-sm">High</Label>
                              </div>
                            </RadioGroup>
                          )}
                        />
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-3">Formatting</h4>
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="defaultStyleBulletPoints"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-sm font-normal cursor-pointer">Bullet points</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="defaultStyleQuotes"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-sm font-normal cursor-pointer">Quotes</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="defaultStyleAbbreviations"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-sm font-normal cursor-pointer">Abbreviations</FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Echo Suppression */}
              <FormField
                control={form.control}
                name="echoSuppression"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5 max-w-[75%]">
                      <FormLabel className="text-base">Echo Suppression</FormLabel>
                      <FormDescription className="text-sm">
                        Turn off Echo Suppression to enable telehealth sessions through web speakers. This may reduce audio quality for other sessions.
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

          {/* Post-session Defaults */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Post-session defaults</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Automatically create tasks */}
              <FormField
                control={form.control}
                name="autoCreateTasks"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5 max-w-[75%]">
                      <FormLabel className="text-base">Automatically create tasks</FormLabel>
                      <FormDescription className="text-sm">
                        When enabled, Heidi will identify and generate tasks from your sessions.
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

              {/* Automatically open side panel & export email - 2 Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="autoOpenSidePanel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Automatically open side panel</FormLabel>
                      <FormDescription className="text-xs">
                        Choose which panel to open automatically after the initial session note is created.
                      </FormDescription>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="mt-3 space-y-2"
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="Tasks" id="tasks" />
                          <Label htmlFor="tasks" className="text-sm">Tasks</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="Codes" id="codes" />
                          <Label htmlFor="codes" className="text-sm">Codes</Label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value="Do not auto-open" id="none" />
                          <Label htmlFor="none" className="text-sm">Do not auto-open</Label>
                        </div>
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="defaultExportEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Default export email</FormLabel>
                      <FormDescription className="text-xs">
                        Pre-populate an email address for 'Send as email' on a note or document.
                      </FormDescription>
                      <FormControl>
                        <Input
                          placeholder="Enter email address"
                          type="email"
                          className="mt-3"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onReset}>
              Reset to default
            </Button>
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}