import { generateMeta } from "@/lib/utils"
import TasksPage from "./tasks-page"

export async function generateMetadata() {
  return generateMeta({
    title: "Tasks - DocScrib",
    description: "Manage your tasks effectively.",
    canonical: "/dashboard/pages/tasks",
  })
}

export default function Page() {
  return <TasksPage />
}
