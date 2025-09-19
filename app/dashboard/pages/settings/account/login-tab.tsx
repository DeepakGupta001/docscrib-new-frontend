import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield } from "lucide-react";

export function LoginTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login & Security</CardTitle>
        <CardDescription>
          Manage your login credentials and security settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Section */}
          <div className="p-6 rounded-xl border bg-muted/30 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-primary"
                  >
                    <path d="M22 4H2v16h20V4z" />
                    <path d="m22 7-10 7L2 7" />
                  </svg>
                </div>
                <div>
                  <Label className="text-base font-medium">Email address</Label>
                  <p className="text-sm text-muted-foreground">
                    manaswinisharma.manu@gmail.com
                  </p>
                </div>
              </div>

              <Input
                value="manaswinisharma.manu@gmail.com"
                disabled
                className="mt-4"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Your email address cannot be changed on Docscrib. To change your
                password, select reset password on login.
              </p>
            </div>
          </div>

          {/* MFA Section */}
          <div className="p-6 rounded-xl border bg-muted/30 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <Label className="text-base font-medium">
                    Multi-Factor Authentication (MFA)
                  </Label>
                  <p className="text-sm text-muted-foreground">Not enabled</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-4">
                Add an extra layer of security when signing in to your account.
              </p>
            </div>

            <Button variant="default" className="gap-2 w-fit">
              <Shield className="h-4 w-4" />
              Enable MFA
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
