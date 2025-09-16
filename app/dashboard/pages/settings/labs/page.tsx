import { Separator } from "@/components/ui/separator";
import { LabsForm } from "./labs-form";
import { generateMeta } from "@/lib/utils"

// ✅ Page Metadata
export async function generateMetadata() {
  return generateMeta({
    title: "DocScrib Labs - DocScrib",
    description: "Opt-in to selective beta features and get early access to upcoming features.",
    canonical: "/dashboard/pages/settings/labs",
  })
}


export default function LabsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">DocScrib Labs</h3>
        <p className="text-sm text-muted-foreground">
          Opt-in to selective beta features and get early access to upcoming features.
        </p>
      </div>
      <Separator />
      <LabsForm />
    </div>
  );
}
