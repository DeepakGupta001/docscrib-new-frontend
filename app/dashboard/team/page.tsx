import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Users } from "lucide-react"
import { generateMeta } from "@/lib/utils"

export async function generateMetadata() {
  return generateMeta({
    title: "Team - DocScrib",
    description: "Manage your team effectively.",
    canonical: "/dashboard/team",
  })
}

export default function TeamsPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="p-6"> <h1 className="text-2xl font-bold">Your Team</h1>
        <p>Manage Your Team.</p>
      </div>

      <Separator />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <Card className="w-full max-w-md border-0 shadow-none bg-transparent">
          <CardContent className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center">
              <Users className="h-7 w-7 text-slate-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-700">
                Level up your practice by <br /> starting a DocScrib team
              </h2>
              <p className="text-sm text-slate-500 max-w-sm">
                You must upgrade your plan to create a team. Ask your administrator
                to send you an invitation to join an existing team.
              </p>
            </div>

            <div>
              <a href="#" className="text-sm text-slate-500 hover:underline">
                Learn more
              </a>
            </div>

            <Button variant="default" className="w-full h-11">
              ⚡ Upgrade now
            </Button>
          </CardContent>
        </Card>
      </div>


    </div>
  )
}
