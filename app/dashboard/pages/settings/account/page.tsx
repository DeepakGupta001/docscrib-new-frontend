import { Separator } from "@/components/ui/separator";
import { AccountForm } from "./account-form";
import { generateMeta } from "@/lib/utils"

// ✅ Page Metadata
export async function generateMetadata() {
  return generateMeta({
    title: "Account Settings - DocScrib",
    description: "Manage your account settings and preferences.",
    canonical: "/dashboard/pages/settings/account",
  })
}


export default function AccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and personal information.
        </p>
      </div>
      <Separator />
      <AccountForm />
    </div>
  );
}
