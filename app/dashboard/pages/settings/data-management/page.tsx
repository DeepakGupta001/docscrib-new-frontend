import { Separator } from "@/components/ui/separator";
import { DataManagementForm } from "./data-management-form";
import { generateMeta } from "@/lib/utils"

// ✅ Page Metadata
export async function generateMetadata() {
  return generateMeta({
    title: "Data Management - DocScrib",
    description: "Manage your data retention, deletion schedules, and privacy settings.",
    canonical: "/dashboard/pages/settings/data-management",
  })
}


export default function DataManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Data Management</h3>
        <p className="text-sm text-muted-foreground">
          Manage your data retention, deletion schedules, and privacy settings.
        </p>
      </div>
      <Separator />
      <DataManagementForm />
    </div>
  );
}
