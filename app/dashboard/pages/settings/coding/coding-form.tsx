"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, MessageSquare, Code, ChevronRight } from "lucide-react";

export function CodingForm() {
    return (
        <div className="space-y-6">
            {/* Beta Notice */}
            <Card className="bg-gradient-to-br from-white to-blue-50/50">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Code className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                Clinical Coding
                                <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                                    Beta
                                </Badge>
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Automatically generate clinical codes for your notes with AI-powered suggestions.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                    {/* Learn More and Feedback */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button variant="outline" className="flex items-center gap-2 justify-center flex-1">
                            <ExternalLink className="h-4 w-4" />
                            Learn more
                            <ChevronRight className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2 justify-center flex-1">
                            <MessageSquare className="h-4 w-4" />
                            Provide feedback
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* Code Sets */}
            <Card>
                <CardHeader>
                    <CardTitle>Code Sets</CardTitle>
                    <CardDescription>
                        Select the clinical coding standards for your region
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* United Kingdom */}
                    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                        <div className="space-y-1">
                            <Label className="text-base font-medium">United Kingdom</Label>
                            <p className="text-sm text-muted-foreground">SNOMED-UK Clinical Terms</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground hidden sm:inline">Enabled</span>
                            <Switch defaultChecked />
                        </div>
                    </div>

                    {/* United States */}
                    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                        <div className="space-y-1">
                            <Label className="text-base font-medium">United States</Label>
                            <p className="text-sm text-muted-foreground">ICD-10-CM</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground hidden sm:inline">Disabled</span>
                            <Switch />
                        </div>
                    </div>
                    
                    {/* Coming Soon */}
                    <div className="p-4 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>More coding standards coming soon</span>
                            <Badge variant="outline" className="ml-2">Q2 2024</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
            
            
        </div>
    );
}