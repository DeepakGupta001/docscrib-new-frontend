import { Separator } from "@/components/ui/separator";
import { DisplayControlsForm } from "./display-controls-form";
import { generateMeta } from "@/lib/utils"

// ✅ Page Metadata
export async function generateMetadata() {
  return generateMeta({
    title: "Display Controls - DocScrib",
    description: "Manage your display preferences and session viewing options.",
    canonical: "/dashboard/pages/settings/display-controls",
  })
}


export default function DisplayControlsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Display Controls</h3>
        <p className="text-sm text-muted-foreground">
          Manage your display preferences and session viewing options.
        </p>
      </div>
      <Separator />
      <DisplayControlsForm />
    </div>
  );
}
