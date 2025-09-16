import { Separator } from "@/components/ui/separator";
import { NotificationsForm } from "./notifications-form";
import { generateMeta } from "@/lib/utils"

// ✅ Page Metadata
export async function generateMetadata() {
  return generateMeta({
    title: "Notifications - DocScrib",
    description: "Manage your notification preferences, methods, and settings.",
    canonical: "/dashboard/pages/settings/notifications",
  })
}


export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Manage your notification preferences, methods, and settings.
        </p>
      </div>
      <Separator />
      <NotificationsForm />
    </div>
  );
}
