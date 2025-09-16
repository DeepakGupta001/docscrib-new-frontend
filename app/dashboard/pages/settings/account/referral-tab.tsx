import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift } from "lucide-react";

export function ReferralTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Referral Program
        </CardTitle>
        <CardDescription>
          Share Heidi with your network and earn rewards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Refer your network and help them discover Heidi's powerful features.
        </p>
        <p className="text-sm text-muted-foreground">
          Earn $10 per sign up and $40 per paid user. T&Cs apply.
        </p>
        <Button className="gap-2">
          <Gift className="h-4 w-4" />
          Get my referral link
        </Button>
      </CardContent>
    </Card>
  );
}
