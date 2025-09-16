import { Separator } from "@/components/ui/separator";
import { CodingForm } from "./coding-form";
import { generateMeta } from "@/lib/utils";

// ✅ Page Metadata
export async function generateMetadata() {
  return generateMeta({
    title: "Coding Settings - DocScrib",
    description: "Manage your coding integrations and clinical code generation settings.",
    canonical: "/dashboard/pages/settings/coding",
  });
}

export default function CodingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Integration - Coding</h3>
        <p className="text-sm text-muted-foreground">
          Automatically generate clinical codes for your notes.
        </p>
      </div>
      <Separator />
      <CodingForm />
    </div>
  );
}
