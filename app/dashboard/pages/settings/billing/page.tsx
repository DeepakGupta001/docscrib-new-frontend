import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { generateMeta } from "@/lib/utils";
import { CreditCard, Calendar, Download, ArrowUpRight, CheckCircle2, Crown } from "lucide-react";

// ✅ Page Metadata
export async function generateMetadata() {
  return generateMeta({
    title: "Billing Settings - DocScrib",
    description: "Manage your billing and subscription settings.",
    canonical: "/dashboard/pages/settings/billing",
  });
}

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription plan and billing information
        </p>
      </div>
      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                Current Plan
              </CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Active
              </Badge>
            </div>
            <CardDescription>
              Your current subscription details and billing information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">Pro Plan</h3>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                    Free trial
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Full access to all Pro features
                </p>
                <div className="flex items-baseline gap-1 pt-2">
                  <span className="text-2xl font-bold">$29</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
              </div>

              <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Trial ends in</span>
                </div>
                <p className="text-lg font-semibold">14 days</p>
                <p className="text-xs text-muted-foreground">
                  On November 15, 2023
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <h4 className="font-medium">What's included:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Unlimited templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Priority support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Advanced analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Custom branding</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button className="gap-2">
                <ArrowUpRight className="h-4 w-4" />
                Upgrade to Enterprise
              </Button>
              <Button variant="outline">Manage Plan</Button>
            </div>
          </CardContent>
        </Card>

        {/* Billing Information */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Billing Information
            </CardTitle>
            <CardDescription>
              Your payment method and billing history
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Payment method</span>
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  Change
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-12 rounded-md bg-blue-100 border flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-800">VISA</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Visa ending in 4242</p>
                  <p className="text-xs text-muted-foreground">Expires 12/2024</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Billing cycle</span>
              </div>
              <p className="text-sm">Monthly</p>
              <p className="text-xs text-muted-foreground">Next charge: November 15, 2023</p>
            </div>

            <div className="space-y-3 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Billing address</span>
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                  Edit
                </Button>
              </div>
              <p className="text-sm">
                123 Main St<br />
                San Francisco, CA 94103<br />
                United States
              </p>
            </div>

            <Button variant="outline" className="w-full gap-2">
              <Download className="h-4 w-4" />
              Download invoices
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            Your recent invoices and payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-1">
                <p className="font-medium">October 2023</p>
                <p className="text-sm text-muted-foreground">October 15, 2023</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$29.00</p>
                <p className="text-sm text-muted-foreground">Paid</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Download className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-1">
                <p className="font-medium">September 2023</p>
                <p className="text-sm text-muted-foreground">September 15, 2023</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$29.00</p>
                <p className="text-sm text-muted-foreground">Paid</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Download className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-1">
                <p className="font-medium">August 2023</p>
                <p className="text-sm text-muted-foreground">August 15, 2023</p>
              </div>
              <div className="text-right">
                <p className="font-medium">$29.00</p>
                <p className="text-sm text-muted-foreground">Paid</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button variant="outline" className="w-full mt-4">
            View all billing history
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}