import { generateMeta } from "@/lib/utils";

export async function generateMetadata() {
  return generateMeta({
    title: "New Session - DocScrib",
    description: "Start a new session for note-taking and transcription.",
    canonical: "/dashboard/new-session",
  })
}

export default function NewSessionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
