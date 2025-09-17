import { generateMeta } from "@/lib/utils"

export async function generateMetadata() {
  return generateMeta({
    title: "Template Library - DocScrib",
    description: "Manage your templates and create new ones",
    canonical: "/dashboard/template-library",
  })
}

export default function TemplateLibraryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
