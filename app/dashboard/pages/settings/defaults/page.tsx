import { Separator } from "@/components/ui/separator";
import { DefaultsForm } from "./defaults-form";
import { generateMeta } from "@/lib/utils"

// ✅ Page Metadata
export async function generateMetadata() {
  return generateMeta({
    title: "Defaults Settings - DocScrib",
    description: "Manage your default settings and preferences.",
    canonical: "/dashboard/pages/settings/defaults",
  })
}

export default function DefaultsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Defaults</h3>
        <p className="text-sm text-muted-foreground">
          Configure your default settings for language, sessions, and post-session actions.
        </p>
      </div>
      <Separator />
      <DefaultsForm />
    </div>
  );
}
