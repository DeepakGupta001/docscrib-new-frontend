import { generateMeta } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Star, Download, MoreHorizontal, Search, Filter, ChevronLeft } from "lucide-react"

// ✅ Page Metadata
export async function generateMetadata() {
  return generateMeta({
    title: "Community Templates - DocScrib",
    description: "Browse and explore templates shared by the community.",
    canonical: "/dashboard/community",
  })
}

// Function to get initials from a name
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((part: string) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function CommunityTemplatesPage() {
  const communityTemplates = [
    { 
      name: "Pediatric H&P", 
      type: "Note", 
      downloads: 125, 
      creator: "Dr. Amy Wong", 
      avatar: "/avatars/aw.png",
      lastUpdated: "Sep 10, 2025", 
      tags: ["Pediatrics", "General"],
      rating: 4.8
    },
    { 
      name: "Cardiology Discharge Summary", 
      type: "Document", 
      downloads: 98, 
      creator: "Dr. Rahul Sharma", 
      avatar: "/avatars/rs.png",
      lastUpdated: "Sep 8, 2025", 
      tags: ["Cardiology", "Hospital"],
      rating: 4.5
    },
    { 
      name: "Orthopedic Progress Note", 
      type: "Note", 
      downloads: 64, 
      creator: "Dr. Kevin Miles", 
      avatar: "/avatars/km.png",
      lastUpdated: "Sep 7, 2025", 
      tags: ["Orthopedics"],
      rating: 4.2
    },
    { 
      name: "Psychiatric Evaluation", 
      type: "Assessment", 
      downloads: 87, 
      creator: "Dr. Lisa Chen", 
      avatar: "/avatars/lc.png",
      lastUpdated: "Sep 5, 2025", 
      tags: ["Psychiatry", "Mental Health"],
      rating: 4.7
    },
    { 
      name: "Surgical Consent Form", 
      type: "Form", 
      downloads: 156, 
      creator: "Dr. Marcus Johnson", 
      avatar: "/avatars/mj.png",
      lastUpdated: "Sep 3, 2025", 
      tags: ["Surgery", "Consent"],
      rating: 4.9
    },
    { 
      name: "Diabetes Management Plan", 
      type: "Plan", 
      downloads: 112, 
      creator: "Dr. Sarah Williams", 
      avatar: "/avatars/sw.png",
      lastUpdated: "Sep 1, 2025", 
      tags: ["Endocrinology", "Chronic Care"],
      rating: 4.6
    },
    { 
      name: "Physical Therapy Initial Eval", 
      type: "Evaluation", 
      downloads: 76, 
      creator: "Dr. James Wilson", 
      avatar: "/avatars/jw.png",
      lastUpdated: "Aug 29, 2025", 
      tags: ["Physical Therapy", "Rehab"],
      rating: 4.4
    },
    { 
      name: "Prenatal Visit Template", 
      type: "Note", 
      downloads: 93, 
      creator: "Dr. Emily Rodriguez", 
      avatar: "/avatars/er.png",
      lastUpdated: "Aug 27, 2025", 
      tags: ["OB/GYN", "Prenatal"],
      rating: 4.7
    },
    { 
      name: "ER Triage Note", 
      type: "Note", 
      downloads: 134, 
      creator: "Dr. Michael Thompson", 
      avatar: "/avatars/mt.png",
      lastUpdated: "Aug 25, 2025", 
      tags: ["Emergency", "Triage"],
      rating: 4.3
    },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold">Community Templates</h1>
        <Button variant="outline" className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back to my templates
        </Button>
      </div>

      <Separator />

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search community templates" className="pl-9" />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Select>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Specialty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              <SelectItem value="cardiology">Cardiology</SelectItem>
              <SelectItem value="pediatrics">Pediatrics</SelectItem>
              <SelectItem value="orthopedics">Orthopedics</SelectItem>
            </SelectContent>
          </Select>
          
          <Select>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently updated</SelectItem>
              <SelectItem value="popular">Most popular</SelectItem>
              <SelectItem value="downloads">Most downloads</SelectItem>
              <SelectItem value="rating">Highest rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Template List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {communityTemplates.map((t, i) => (
          <Card key={i} className="flex flex-col justify-between h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium line-clamp-1">{t.name}</CardTitle>
                <Badge variant="secondary">{t.type}</Badge>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={t.avatar} alt={t.creator} />
                  <AvatarFallback className="text-xs bg-primary/10">
                    {getInitials(t.creator)}
                  </AvatarFallback>
                </Avatar>
                <p className="text-xs text-muted-foreground">By {t.creator}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1 mb-3">
                {t.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
              
              <div className="flex justify-between items-center text-xs text-muted-foreground mb-3">
                <span>Last updated: {t.lastUpdated}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{t.rating}</span>
                </div>
              </div>
              
              <Separator className="my-3" />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Download className="h-3.5 w-3.5" />
                  <span>{t.downloads} downloads</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button size="sm" className="h-8 gap-1">
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Report</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">4</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">5</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
